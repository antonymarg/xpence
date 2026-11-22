import * as userApi from "@/api/users.api";
import { useMutation } from "@tanstack/react-query";

export class InvalidPasswordError extends Error {
    constructor() {
        super("Invalid password");
        this.name = "InvalidPasswordError";
    }
}

type CredentialResult = Awaited<ReturnType<typeof userApi.changePassword>>;

const unwrapCredentialResult = async (promise: Promise<CredentialResult>) => {
    const result = await promise;
    if (!result.success) throw result.invalidPassword ? new InvalidPasswordError() : result.error;
    return result.data;
};

export const useChangePassword = () =>
    useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
            unwrapCredentialResult(userApi.changePassword(currentPassword, newPassword)),
    });

export const useDeleteAccount = () =>
    useMutation({
        mutationFn: (currentPassword: string) =>
            unwrapCredentialResult(userApi.deleteAccount(currentPassword)),
    });
