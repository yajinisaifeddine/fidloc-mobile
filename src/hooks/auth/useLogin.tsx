import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { LoginPayload, loginRequest, LoginResponse } from "../../api/auth.api";
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
