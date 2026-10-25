import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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

export default function Signup() {
  const { t } = useTranslation();
  const schema = z
    .object({
      email: z.string().email(t("validation.invalidEmail")),
      password: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
      confirmPassword: z.string().min(8, t("validation.passwordMinLength", { count: 8 })),
      name: z.string().min(3, t("validation.nameMinLength", { count: 3 })),
      budget: z.coerce.number({ error: t("validation.validBudget") }).min(0, t("validation.validBudget")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });

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

  const onSignupPress = async (formData: z.infer<typeof schema>) => {
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
        setSignupError(t("auth.signupFailed"));
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
        setSignupError(t("auth.profileCreationFailed"));
        return;
      }
    } catch {
      setSignupError(t("auth.unexpectedError"));
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
              placeholder={t("auth.namePlaceholder")}
              label={t("auth.nameLabel")}
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
              placeholder={t("auth.emailPlaceholder")}
              label={t("common.email")}
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
              placeholder={t("auth.passwordPlaceholder")}
              label={t("common.password")}
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
              placeholder={t("auth.confirmPassword")}
              label={t("auth.confirmPassword")}
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
              label={t("auth.monthlyGoal")}
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
              {t("auth.signUp")}
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
