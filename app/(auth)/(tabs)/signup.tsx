import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

export default function Signup() {
    const { t } = useTranslation();

    const schema = z
        .object({
            email: z.string().email(t("validation.invalidEmail")),
            password: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
            confirmPassword: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("validation.passwordsMismatch"),
            path: ["confirmPassword"],
        });

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSignupPress = async (formData: z.infer<typeof schema>) => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email.trim(),
                password: formData.password,
                options: {
                    emailRedirectTo: Linking.createURL("/callback"),
                }
            });
            if (signUpError || !authData?.user?.id) {
                Toast.show({
                    type: "error",
                    text1: t("auth.signupFailed"),
                    visibilityTime: 5000,
                    autoHide: true,
                });
                return;
            }
            setIsSuccess(true);
        } catch {
            Toast.show({
                type: "error",
                text1: t("auth.unexpectedError"),
                visibilityTime: 5000,
                autoHide: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inputContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {isSuccess ? (
                    <View style={styles.successContainer}>
                        <Icon name="checkmark-circle" size={48} color={theme.colors.primaryRed} />
                        <Text size='xxl' weight="bold">{t("auth.signupSuccess")}</Text>
                        <Text size='md'>{t("auth.confirmEmail")}</Text>
                    </View>
                ) : (
                    <>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <TextInput
                                    placeholder={t("auth.emailPlaceholder")}
                                    label={t("auth.emailLabel")}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    error={errors?.email?.message}
                                    editable={!loading}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <TextInput
                                    placeholder={t("auth.passwordPlaceholder")}
                                    label={t("auth.passwordLabel")}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    secureTextEntry
                                    error={errors?.password?.message}
                                    editable={!loading}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <TextInput
                                    placeholder={t("auth.confirmPasswordPlaceholder")}
                                    label={t("auth.confirmPasswordLabel")}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    secureTextEntry
                                    error={errors?.confirmPassword?.message}
                                    editable={!loading}
                                />
                            )}
                        />

                        <Button
                            disabled={loading}
                            onPress={handleSubmit(onSignupPress)}
                            background="gradient"
                            block
                            style={styles.button}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text weight="bold" size='xl' color="white">
                                    {t("auth.signup")}
                                </Text>
                            )}
                        </Button>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.lg,
    },
    inputContainer: {
        gap: theme.spacing.lg,
    },
    successContainer: {
        gap: theme.spacing.md,
        alignItems: "center",
    },
    button: {
        borderColor: theme.colors.divider,
        borderWidth: 1,
    },
});
