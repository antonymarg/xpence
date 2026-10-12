import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    name: z.string().min(3),
    budget: z.coerce.number().min(0),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const [loading, setLoading] = React.useState(false);
  const [signupError, setSignupError] = React.useState<string | null>(null);

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
      name: "",
      budget: "",
    }
  });

  const onSignupPress = async (formData: FormData) => {
    setSignupError(null);
    Keyboard.dismiss();
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email.trim(),
          password: formData.password,
        },
      );
      if (signUpError || !authData?.user?.id) {
        setSignupError("Failed to sign up");
        return;
      }
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: authData.user.id,
          display_name: formData.name,
          budget: formData.budget,
        });
      if (profileError) {
        setSignupError("Failed to create profile");
        return;
      }
    } catch {
      setSignupError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {signupError && <Alert message={signupError} type="error" />}
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextInput
              placeholder="John"
              label="What's your name?"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors?.name?.message}
              editable={!loading}
            />
          )}
        />
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
              error={errors?.email?.message}
              editable={!loading}
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
              error={errors?.password?.message}
              editable={!loading}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <TextInput
              placeholder="Confirm password"
              label="Confirm password"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors?.confirmPassword?.message}
              editable={!loading}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="budget"
          render={({ field }) => (
            <TextInput
              placeholder="0"
              label="What is your monthly goal?"
              inputMode="numeric"
              value={field.value?.toString()}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors?.budget?.message}
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
              Sign Up
            </Text>
          )}
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
  },
});
