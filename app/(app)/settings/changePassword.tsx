import Button from "@/components/Button";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { InvalidPasswordError, useChangePassword } from "@/hooks/useAccountMutations";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import z from "zod";

function ChangePassword() {
    const { t } = useTranslation();
    const navigator = useNavigation();
    const { mutate: changePassword, isPending: loading } = useChangePassword();

    const schema = z
        .object({
            currentPassword: z.string().min(1, t("validation.currentPasswordRequired")),
            newPassword: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
            confirmPassword: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("validation.passwordsMismatch"),
            path: ["confirmPassword"],
        })
        .refine((data) => data.newPassword !== data.currentPassword, {
            message: t("validation.newPasswordSameAsCurrent"),
            path: ["newPassword"],
        });

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        Keyboard.dismiss();
        changePassword(
            { currentPassword: data.currentPassword, newPassword: data.newPassword },
            {
                onSuccess: () => {
                    showSuccessToast(t("settings.passwordUpdated"));
                    navigator.goBack();
                },
                onError: (error) => {
                    if (error instanceof InvalidPasswordError) {
                        setError("currentPassword", { message: t("validation.incorrectPassword") });
                    } else {
                        showErrorToast(t("common.actionFailed"));
                    }
                },
            }
        );
    };

    const fields = [
        { name: "currentPassword", label: t("settings.currentPassword") },
        { name: "newPassword", label: t("settings.newPassword") },
        { name: "confirmPassword", label: t("auth.confirmPasswordLabel") },
    ] as const;

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <SettingsHeader label={t("settings.changePassword")} href="/(app)/settings" />
            {fields.map(({ name, label }) => (
                <Controller
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <TextInput
                            label={label}
                            placeholder={label}
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                            error={errors[name]?.message}
                            editable={!loading}
                        />
                    )}
                />
            ))}
            <Button onPress={handleSubmit(onSubmit)} block background="gradient" loading={loading}>
                <Text weight="bold" color="white">
                    {t("settings.updatePassword")}
                </Text>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        gap: theme.spacing.md,
        flexGrow: 1,
    },
});

export default ChangePassword;
