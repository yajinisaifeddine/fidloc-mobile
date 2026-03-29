import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { SignUpPayload, signUpRequest, SignUpRequestResponse } from "../../api/auth.api";
import { ApiResponse } from "../../lib/api";

export const useSignUp = (): UseMutationResult<
    ApiResponse<SignUpRequestResponse>,
    Error,
    SignUpPayload
> => {
    return useMutation({
        mutationFn: (payload: SignUpPayload) => signUpRequest(payload),
    });
};
