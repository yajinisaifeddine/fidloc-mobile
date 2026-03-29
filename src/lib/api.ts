import { API_BASE_URL } from '@env';
import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { storage } from './storage';
import { authEvents } from './authEvents';
import { log } from './logger';

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

log.info(`[apiClient] Initialized — baseURL: ${API_BASE_URL}`);

// ─── Request Interceptor ───────────────────────────────────────────────────

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = storage.getString(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      log.debug(`[Request] Token attached`);
    } else {
      log.warn(`[Request] No token found — sending unauthenticated`);
    }

    log.info(
      `[Request] ▶ ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`,
    );
    log.debug(`[Request] Headers: ${JSON.stringify(config.headers, null, 2)}`);

    if (config.params) {
      log.debug(`[Request] Params: ${JSON.stringify(config.params, null, 2)}`);
    }
    if (config.data) {
      log.debug(`[Request] Body: ${JSON.stringify(config.data, null, 2)}`);
    }

    return config;
  },
  error => {
    log.error(`[Request] Interceptor error: ${error?.message}`);
    return Promise.reject(error);
  },
);

// ─── Token Refresh ─────────────────────────────────────────────────────────

let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const flushQueue = (error: unknown, token: string | null = null) => {
  log.debug(
    `[Queue] Flushing ${pendingQueue.length} pending request(s) — ${
      error ? 'with error' : 'with new token'
    }`,
  );
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = storage.getString(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    log.error(`[Refresh] No refresh token in storage`);
    throw new Error('No refresh token available');
  }

  log.info(`[Refresh] Attempting token refresh...`);

  const response = await axios.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >(`${API_BASE_URL}/auth/refresh`, { refreshToken });

  const { success, data, msg } = response.data;

  if (!success || !data) {
    log.error(`[Refresh] Failed — server response: ${msg}`);
    throw new Error(msg || 'Refresh failed');
  }

  storage.set(TOKEN_KEY, data.accessToken);
  storage.set(REFRESH_TOKEN_KEY, data.refreshToken);

  log.info(`[Refresh] Success — new tokens stored`);
  return data.accessToken;
};

// ─── Response Interceptor ──────────────────────────────────────────────────

type FailedRequest = AxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    log.info(
      `[Response] ◀ ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`,
    );
    log.debug(
      `[Response] Headers: ${JSON.stringify(response.headers, null, 2)}`,
    );
    log.debug(`[Response] Body: ${JSON.stringify(response.data, null, 2)}`);

    if (response.data && response.data.success === false) {
      log.warn(
        `[Response] HTTP 200 but success=false — msg: "${response.data.msg}"`,
      );
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

    log.error(
      `[Response] Error on ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
    );
    log.error(
      `[Response] Status: ${error.response?.status ?? 'N/A'} | Code: ${
        error.code
      } | Message: ${error.message}`,
    );

    if (error.response) {
      log.debug(
        `[Response] Error body: ${JSON.stringify(
          error.response.data,
          null,
          2,
        )}`,
      );
      log.debug(
        `[Response] Error headers: ${JSON.stringify(
          error.response.headers,
          null,
          2,
        )}`,
      );
    } else {
      log.warn(
        `[Response] No response received — possible network/timeout issue`,
      );
    }

    const isUnauthorized =
      error.response?.status === 401 || responseData?.success === false;
    const alreadyRetried = originalRequest._retry;

    if (!isUnauthorized || alreadyRetried) {
      if (alreadyRetried)
        log.warn(`[Response] Already retried — not refreshing again`);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      log.debug(
        `[Response] Refresh in progress — queuing request to ${originalRequest.url}`,
      );
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
    log.info(`[Response] 401 detected — starting token refresh`);

    try {
      const newToken = await refreshAccessToken();
      flushQueue(null, newToken);
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      log.info(
        `[Response] Retrying original request to ${originalRequest.url}`,
      );
      return apiClient(originalRequest);
    } catch (refreshError: any) {
      log.error(
        `[Response] Refresh failed — logging out. Reason: ${refreshError?.message}`,
      );
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
