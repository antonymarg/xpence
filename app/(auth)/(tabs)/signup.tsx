import Button from "@/components/Button";
import Icon from "@/components/Icon";
import PolicyModal, { POLICY_VERSION } from "@/components/PolicyModal";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { showErrorToast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    StyleSheet,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import z from "zod";

export default function Signup() {
    const { t } = useTranslation();

    const schema = z
        .object({
            email: z.string().email(t("validation.invalidEmail")),
            password: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
            confirmPassword: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
            acceptedPolicy: z.boolean().refine((value) => value, {
                message: t("validation.policyRequired"),
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("validation.passwordsMismatch"),
            path: ["confirmPassword"],
        });

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPolicyVisible, setIsPolicyVisible] = useState(false);

    const {
        control,
        handleSubmit,
        setValue,
        setFocus,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            acceptedPolicy: false,
        },
    });

    const onSignupPress = async (formData: z.infer<typeof schema>) => {
        Keyboard.dismiss();
        setLoading(true);
        const emailToRedirect = Linking.createURL("callback");
        try {
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email.trim(),
                password: formData.password,
                options: {
                    emailRedirectTo: emailToRedirect,
                    data: {
                        policy_version: POLICY_VERSION,
                        policy_accepted_at: new Date().toISOString(),
                    },
                }
            });
            if (signUpError || !authData?.user?.id) {
                showErrorToast(t("auth.signupFailed"));
                return;
            }
            setIsSuccess(true);
        } catch {
            showErrorToast(t("auth.unexpectedError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.inputContainer}
                keyboardShouldPersistTaps="handled"
                bottomOffset={theme.spacing.lg}
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
                                    ref={field.ref}
                                    returnKeyType="next"
                                    submitBehavior="submit"
                                    onSubmitEditing={() => setFocus("password")}
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
                                    ref={field.ref}
                                    returnKeyType="next"
                                    submitBehavior="submit"
                                    onSubmitEditing={() => setFocus("confirmPassword")}
                                    placeholder={t("auth.passwordPlaceholder")}
                                    label={t("auth.passwordLabel")}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    autoCapitalize="none"
                                    autoCorrect={false}
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
                                    ref={field.ref}
                                    returnKeyType="done"
                                    placeholder={t("auth.confirmPasswordPlaceholder")}
                                    label={t("auth.confirmPasswordLabel")}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry
                                    error={errors?.confirmPassword?.message}
                                    editable={!loading}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="acceptedPolicy"
                            render={({ field }) => (
                                <View>
                                    <View style={styles.policyRow}>
                                        <Pressable
                                            accessibilityRole="checkbox"
                                            accessibilityState={{ checked: field.value }}
                                            onPress={() => field.onChange(!field.value)}
                                            disabled={loading}
                                            hitSlop={8}
                                        >
                                            <Icon
                                                name={field.value ? "checkbox" : "square-outline"}
                                                size={22}
                                                padding="xs"
                                                color={errors.acceptedPolicy ? theme.colors.error : theme.colors.primaryRed}
                                            />
                                        </Pressable>
                                        <Text style={styles.policyText}>
                                            {t("auth.agreeTo")}{" "}
                                            <Text
                                                color="primaryRed"
                                                weight="bold"
                                                onPress={() => setIsPolicyVisible(true)}
                                            >
                                                {t("auth.termsAndPrivacy")}
                                            </Text>
                                        </Text>
                                    </View>
                                    {errors.acceptedPolicy && (
                                        <Text size="sm" color="error">{errors.acceptedPolicy.message}</Text>
                                    )}
                                </View>
                            )}
                        />

                        <PolicyModal
                            visible={isPolicyVisible}
                            onClose={() => setIsPolicyVisible(false)}
                            onAccept={() => {
                                setValue("acceptedPolicy", true, { shouldValidate: true });
                                setIsPolicyVisible(false);
                            }}
                        />

                        <Button
                            onPress={handleSubmit(onSignupPress)}
                            background="gradient"
                            block
                            style={styles.button}
                            loading={loading}
                        >
                            <Text weight="bold" size='xl' color="white">
                                {t("auth.signup")}
                            </Text>
                        </Button>
                    </>
                )}
            </KeyboardAwareScrollView>
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
    policyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    policyText: {
        flex: 1,
    },
    button: {
        borderColor: theme.colors.divider,
        borderWidth: 1,
    },
});
