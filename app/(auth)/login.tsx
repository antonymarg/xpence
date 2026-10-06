import Alert from "@/components/Alert";
import AuthWrapper from "@/components/AuthWrapper";
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
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import z from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onLoginPress = async (data: FormData) => {
    setLoginError(null);
    setLoading(true);
    Keyboard.dismiss();
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });
      if (loginError) {
        setLoginError(loginError.message);
      }
    } catch {
      setLoginError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = () => { };

  return (
    <AuthWrapper>
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
              placeholder="name@example.com"
              label="Email"
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
              placeholder="Password"
              label="Password"
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
              Continue
            </Text>
          )}
        </Button>
        <DividerText text="or" />
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
          <Text weight="bold">Continue with Google</Text>
        </Button>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Text>New here?</Text>
        <Link href="/(auth)/signup">
          <Text color="primaryRed" weight="bold">
            Create an account
          </Text>
        </Link>
      </View>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
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
