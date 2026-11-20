import * as userApi from "@/api/users.api";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import z from "zod";

function ChangePassword() {
    const { t } = useTranslation();
    const navigator = useNavigation();
    const [loading, setLoading] = useState(false);

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

    const onSubmit = async (data: z.infer<typeof schema>) => {
        Keyboard.dismiss();
        setLoading(true);
        const result = await userApi.changePassword(data.currentPassword, data.newPassword);
        setLoading(false);

        if (result.success) {
            showSuccessToast(t("settings.passwordUpdated"));
            navigator.goBack();
        } else if (result.invalidPassword) {
            setError("currentPassword", { message: t("validation.incorrectPassword") });
        } else {
            showErrorToast(t("common.actionFailed"));
        }
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
            <Button onPress={handleSubmit(onSubmit)} disabled={loading} block background="gradient">
                {loading ? (
                    <Loading />
                ) : (
                    <Text weight="bold" color="white">
                        {t("settings.updatePassword")}
                    </Text>
                )}
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
