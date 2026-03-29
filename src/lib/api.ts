import { API_BASE_URL } from '@env';
import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { storage } from './storage';
import { authEvents } from './authEvents';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';

export interface ApiResponse<T = any> {
  success: boolean;
  msg: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = storage.getString(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const flushQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = storage.getString(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('No refresh token available');

  // Direct axios call to avoid interceptor loops
  const response = await axios.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >(`${API_BASE_URL}/auth/refresh`, { refreshToken });

  const { success, data, msg } = response.data;

  if (!success || !data) {
    throw new Error(msg || 'Refresh failed');
  }

  storage.set(TOKEN_KEY, data.accessToken);
  storage.set(REFRESH_TOKEN_KEY, data.refreshToken);

  return data.accessToken;
};

type FailedRequest = AxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Handle cases where API returns 200 OK but success is false
    if (response.data && response.data.success === false) {
      return Promise.reject({
        response,
        message: response.data.msg,
      });
    }
    return response;
  },
  async error => {
    const originalRequest: FailedRequest = error.config;
    const responseData = error.response?.data as ApiResponse | undefined;

    // Trigger refresh on 401 OR if the API explicitly sent success: false with an auth-related message
    const isUnauthorized =
      error.response?.status === 401 || responseData?.success === false;
    const alreadyRetried = originalRequest._retry;

    if (!isUnauthorized || alreadyRetried) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      flushQueue(null, newToken);
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return apiClient(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      storage.remove(TOKEN_KEY);
      storage.remove(REFRESH_TOKEN_KEY);
      authEvents.emit('logout');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
