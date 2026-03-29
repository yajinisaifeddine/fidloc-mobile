import apiClient, { ApiResponse } from '../lib/api';

export interface LoginPayload {
  email: string;
  password: string;
}
export interface SignUpPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
export interface SignUpRequestResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}
export interface VerifyPayload {
  userId: string;
  token: string;
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

export const signUpRequest = async (
  payload: SignUpPayload,
): Promise<ApiResponse<SignUpRequestResponse>> => {
  const { data } = await apiClient.post('/auth/sign-up', payload);
  return data;
};

export const verifyRequest = async (
  payload: VerifyPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await apiClient.post('/auth/verify', payload);
  return data;
};
