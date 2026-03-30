import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { FinalizeResetPayload, finalizeResetRequest, LoginPayload, loginRequest, LoginResponse, RequestResetPayload, requestResetRequest, ResendPayload, resendRequest, SignUpPayload, signUpRequest, SignUpRequestResponse, VerifyPayload, verifyRequest, VerifyResetPayload, verifyResetRequest } from "../../api/auth.api";
import { ApiResponse } from "../../lib/api";

export const useLogin = (): UseMutationResult<
    ApiResponse<LoginResponse>,
    Error,
    LoginPayload
> => {
    return useMutation({
        mutationFn: (payload: LoginPayload) => loginRequest(payload),
    });
};
export const useSignUp = (): UseMutationResult<
    ApiResponse<SignUpRequestResponse>,
    Error,
    SignUpPayload
> => {
    return useMutation({
        mutationFn: (payload: SignUpPayload) => signUpRequest(payload),
    });
};

export const useVerify = (): UseMutationResult<
    ApiResponse<LoginResponse>,
    Error,
    VerifyPayload
> => {
    return useMutation({
        mutationFn: (payload: VerifyPayload) => verifyRequest(payload),
    });
};
export const useResend = (): UseMutationResult<
    ApiResponse, Error, ResendPayload
> => {
    return useMutation({
        mutationFn: (payload: ResendPayload) => resendRequest(payload)
    })
}

export const useRequestReset = (): UseMutationResult<
    ApiResponse,
    Error,
    RequestResetPayload
> => {
    return useMutation({
        mutationFn: (payload: RequestResetPayload) => requestResetRequest(payload),
    });
};

export const useVerifyReset = (): UseMutationResult<
    ApiResponse,
    Error,
    VerifyResetPayload
> => {
    return useMutation({
        mutationFn: (payload: VerifyResetPayload) => verifyResetRequest(payload),
    });
};

export const useFinalizeReset = (): UseMutationResult<
    ApiResponse,
    Error,
    FinalizeResetPayload
> => {
    return useMutation({
        mutationFn: (payload: FinalizeResetPayload) => finalizeResetRequest(payload),
    });
};
