import * as userApi from "@/api/users.api";
import { unwrap } from "@/lib/utils";
import { Currency, Locale, Profile } from "@/types/users.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useInvalidateProfile = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ["profile"] });
};

export const useCreateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (profile: Omit<Profile, "userId">) => unwrap(userApi.createUserProfile(profile)),
        onSuccess: () => {
            // A fresh profile and its default categories were just created; drop anything
            // cached from before onboarding so the app loads them from scratch.
            queryClient.removeQueries({ queryKey: ["profile"] });
            queryClient.removeQueries({ queryKey: ["categories"] });
        },
    });
};

export const useUpdateBudget = () => {
    const invalidateProfile = useInvalidateProfile();
    return useMutation({
        mutationFn: (budget: number) => unwrap(userApi.updateUserBudget(budget)),
        onSuccess: invalidateProfile,
    });
};

export const useUpdateCurrency = () => {
    const invalidateProfile = useInvalidateProfile();
    return useMutation({
        mutationFn: (currency: Currency) => unwrap(userApi.updateUserCurrency(currency)),
        onSuccess: invalidateProfile,
    });
};

export const useUpdateLocale = () => {
    const invalidateProfile = useInvalidateProfile();
    return useMutation({
        mutationFn: (locale: Locale) => unwrap(userApi.updateUserLocale(locale)),
        onSuccess: invalidateProfile,
    });
};
