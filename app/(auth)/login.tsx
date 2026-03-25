import Alert from "@/components/Alert";
import AuthWrapper from "@/components/AuthWrapper";
import DividerText from "@/components/DividerText";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
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

  const onGooglePress = () => {};

  return (
    <AuthWrapper>
      {loginError && <Alert message={loginError} type="error" />}
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
        <Pressable disabled={loading} onPress={handleSubmit(onLoginPress)}>
          <LinearGradient
            colors={[
              theme.colors.mainGradient[0],
              theme.colors.mainGradient[1],
            ]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text weight="bold" color="white">
                Continue
              </Text>
            )}
          </LinearGradient>
        </Pressable>
        <DividerText text="or" />
        <Pressable
          style={[styles.button, styles.googleButton]}
          onPress={onGooglePress}
          disabled={loading}
        >
          <Image
            source={require("../../assets/images/google-icon.png")}
            style={styles.googleIcon}
          />
          <Text weight="bold">Continue with Google</Text>
        </Pressable>
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
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.divider,
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: theme.colors.card,
    flexDirection: "row",
    color: theme.colors.textDark,
    gap: theme.spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: "auto",
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
});
