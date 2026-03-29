import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { LoginResponse, VerifyPayload, verifyRequest } from "../../api/auth.api";
import { ApiResponse } from "../../lib/api";

export const useVerify = (): UseMutationResult<
    ApiResponse<LoginResponse>,
    Error,
    VerifyPayload
> => {
    return useMutation({
        mutationFn: (payload: VerifyPayload) => verifyRequest(payload),
    });
};
