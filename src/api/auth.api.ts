import apiClient, { ApiResponse } from '../lib/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginRequest = async (
  payload: LoginPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/sign-in',
    payload,
  );
  return data;
};
