import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

export default function Login() {
    const { t } = useTranslation();

    const schema = z.object({
        email: z.string().email(t("validation.invalidEmail")),
        password: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
    });
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [loading, setLoading] = useState(false);

    const onLoginPress = async (data: z.infer<typeof schema>) => {
        setLoading(true);
        Keyboard.dismiss();
        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: data.email.trim(),
                password: data.password,
            });
            if (loginError) {
                Toast.show({
                    type: "error",
                    text1: t("auth.loginFailed"),
                    visibilityTime: 5000,
                    autoHide: true,
                });
            }
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
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors?.password?.message}
                            editable={!loading}
                        />
                    )}
                />

                <Button
                    disabled={loading}
                    onPress={handleSubmit(onLoginPress)}
                    background="gradient"
                    block
                    style={styles.button}
                >
                    {loading ? (
                        <Loading />
                    ) : (
                        <Text weight="bold" size='xl' color="white">
                            {t("auth.login")}
                        </Text>
                    )}
                </Button>

                <Link href="/(auth)/(tabs)/signup" style={styles.linkText}>
                    <Text size='md' color="primaryRed">
                        {t("auth.noAccount")}
                    </Text>
                </Link>
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
    button: {
        borderColor: theme.colors.divider,
        borderWidth: 1,
    },
    linkText: {
        alignSelf: "center",
    },
});
