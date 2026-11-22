import Button from "@/components/Button";
import Icon from "@/components/Icon";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { InvalidPasswordError, useDeleteAccount } from "@/hooks/useAccountMutations";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import z from "zod";

function DeleteAccount() {
    const { t } = useTranslation();
    const router = useRouter();
    const { mutate: deleteAccount, isPending: loading } = useDeleteAccount();

    const confirmWord = t("settings.deleteConfirmWord");
    const schema = z.object({
        password: z.string().min(1, t("validation.currentPasswordRequired")),
        confirmation: z
            .string()
            .refine((value) => value.trim().toUpperCase() === confirmWord.toUpperCase(), {
                message: t("validation.typeToConfirm", { word: confirmWord }),
            }),
    });

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmation: "" },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        Keyboard.dismiss();
        deleteAccount(data.password, {
            onSuccess: () => {
                showSuccessToast(t("settings.accountDeleted"));
                router.replace("/(auth)/(tabs)/login");
            },
            onError: (error) => {
                if (error instanceof InvalidPasswordError) {
                    setError("password", { message: t("validation.incorrectPassword") });
                } else {
                    showErrorToast(t("common.actionFailed"));
                }
            },
        });
    };

    const consequences = [
        t("settings.deleteConsequenceExpenses"),
        t("settings.deleteConsequenceCategories"),
        t("settings.deleteConsequenceProfile"),
    ];

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <SettingsHeader label={t("settings.deleteAccount")} href="/(app)/settings" />

            <View style={styles.warningCard}>
                <View style={styles.warningTitle}>
                    <Icon name="warning" color={theme.colors.error} size={20} />
                    <Text weight="bold" color="error">
                        {t("settings.deleteWarningTitle")}
                    </Text>
                </View>
                <Text>{t("settings.deleteWarningBody")}</Text>
                {consequences.map((item) => (
                    <View key={item} style={styles.bullet}>
                        <Icon name="close-circle" color={theme.colors.error} size={14} />
                        <Text style={styles.bulletText}>{item}</Text>
                    </View>
                ))}
            </View>

            <Controller
                control={control}
                name="password"
                render={({ field }) => (
                    <TextInput
                        label={t("settings.currentPassword")}
                        placeholder={t("auth.passwordPlaceholder")}
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                        error={errors.password?.message}
                        editable={!loading}
                    />
                )}
            />
            <Controller
                control={control}
                name="confirmation"
                render={({ field }) => (
                    <TextInput
                        label={t("settings.typeToConfirmLabel", { word: confirmWord })}
                        placeholder={confirmWord}
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        error={errors.confirmation?.message}
                        editable={!loading}
                    />
                )}
            />

            <Button onPress={handleSubmit(onSubmit)} block background="primaryRed" loading={loading}>
                <Text weight="bold" color="white">
                    {t("settings.deleteAccountPermanently")}
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
    warningCard: {
        backgroundColor: theme.colors.errorBg,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    warningTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    bullet: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    bulletText: {
        flex: 1,
    },
});

export default DeleteAccount;
