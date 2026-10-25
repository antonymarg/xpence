import Alert from "@/components/Alert";
import Button from "@/components/Button";
import DividerText from "@/components/DividerText";
import Icon from "@/components/Icon";
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
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
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
      password: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onLoginPress = async (data: z.infer<typeof schema>) => {
    setLoginError(null);
    setLoading(true);
    Keyboard.dismiss();
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });
      if (loginError) {
        setLoginError(t("auth.loginFailed"));
      }
    } catch {
      setLoginError(t("auth.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = () => { };

  return (
    <View style={styles.container}>
      {loginError && <Alert message={loginError} type="error" />}
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
              label={t("common.email")}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.email?.message}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              placeholder={t("auth.passwordPlaceholder")}
              label={t("common.password")}
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.password?.message}
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
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text weight="bold" color="white">
              {t("auth.continue")}
            </Text>
          )}
        </Button>
        <DividerText text={t("auth.or")} />
        <Button
          background="card"
          block
          onPress={onGooglePress}
          disabled={loading}
          style={styles.button}
        >
          <Icon
            name="logo-google"
            color={theme.colors.primaryOrange}
            size={20}
          />
          <Text weight="bold">{t("auth.continueWithGoogle")}</Text>
        </Button>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Text>{t("auth.newHere")}</Text>
        <Link href="/(auth)/signup">
          <Text color="primaryRed" weight="bold">
            {t("auth.createAccount")}
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.background
  },
  inputContainer: {
    gap: theme.spacing.lg,
  },
  button: {
    borderColor: theme.colors.divider,
    borderWidth: 1,
    gap: theme.spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: "auto",
  },
});
