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
export interface ResendPayload {
  email: string;
}
export interface RequestResetPayload {
  email: string;
}
export interface VerifyResetPayload {
  email: string;
  token: string;
}
export interface FinalizeResetPayload {
  email: string;
  token: string;
  password: string;
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
  const { data } = await apiClient.post('/auth/sign-up', {
    ...payload,
    role: 'CLIENT',
  });
  return data;
};

export const verifyRequest = async (
  payload: VerifyPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await apiClient.post('/auth/verify', payload);
  return data;
};

// api/auth.ts
export const requestResetRequest = (
  payload: RequestResetPayload,
): Promise<ApiResponse> =>
  apiClient
    .post<ApiResponse>('/auth/password-reset/request', payload)
    .then(r => r.data);

export const verifyResetRequest = (
  payload: VerifyResetPayload,
): Promise<ApiResponse> =>
  apiClient
    .post<ApiResponse>('/auth/password-reset/verify', payload)
    .then(r => r.data);

export const finalizeResetRequest = (
  payload: FinalizeResetPayload,
): Promise<ApiResponse> =>
  apiClient
    .post<ApiResponse>('/auth/password-reset/finalise', payload)
    .then(r => r.data);
export const resendRequest = (payload: ResendPayload): Promise<ApiResponse> =>
  apiClient.post<ApiResponse>('/auth/resend', payload).then(r => r.data);
