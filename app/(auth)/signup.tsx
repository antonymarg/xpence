import Alert from "@/components/Alert";
import AuthWrapper from "@/components/AuthWrapper";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from "react-native";

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

interface InputState {
  value: string;
  error: string | null;
}

export default function Login() {
  const [email, setEmail] = React.useState<InputState>({
    value: "",
    error: null,
  });
  const [password, setPassword] = React.useState<InputState>({
    value: "",
    error: null,
  });
  const [confirmPassword, setConfirmPassword] = React.useState<InputState>({
    value: "",
    error: null,
  });
  const [name, setName] = React.useState<InputState>({
    value: "",
    error: null,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSignupPress = async () => {
    setError(null);
    Keyboard.dismiss();
    if (!email.value) {
      setEmail({ value: email.value, error: "Email is required" });
      return;
    }
    if (!EMAIL_REGEX.test(email.value)) {
      setEmail({ value: email.value, error: "Invalid email" });
      return;
    }
    if (!password.value) {
      setPassword({ value: password.value, error: "Password is required" });
      return;
    }
    if (!confirmPassword.value) {
      setConfirmPassword({
        value: confirmPassword.value,
        error: "Confirm password is required",
      });
      return;
    }
    if (confirmPassword.value !== password.value) {
      setConfirmPassword({
        value: confirmPassword.value,
        error: "Passwords do not match",
      });
      return;
    }
    if (!name.value) {
      setName({ value: name.value, error: "Name is required" });
      return;
    }
    setLoading(true);
    setEmail({ value: email.value, error: null });
    setPassword({ value: password.value, error: null });

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: email.value.trim(),
          password: password.value,
        },
      );
      if (signUpError || !authData?.user?.id) {
        setError("Failed to sign up");
        return;
      }
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: authData.user.id,
          display_name: name.value,
        });
      if (profileError) {
        setError("Failed to create profile");
        return;
      }
    } catch {
      setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      {error && <Alert message={error} type="error" />}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="John"
          label="What's your name?"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: null })}
          error={name.error}
          editable={!loading}
        />
        <TextInput
          placeholder="name@example.com"
          label="Email"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: null })}
          error={email.error}
          editable={!loading}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          label="Password"
          secureTextEntry
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: null })}
          error={password.error}
          editable={!loading}
        />
        <TextInput
          placeholder="Confirm password"
          label="Confirm password"
          secureTextEntry
          value={confirmPassword.value}
          onChangeText={(text) =>
            setConfirmPassword({ value: text, error: null })
          }
          error={confirmPassword.error}
          editable={!loading}
        />
        <Pressable disabled={loading} onPress={onSignupPress}>
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
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </LinearGradient>
        </Pressable>
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
  buttonText: {
    color: "#fff",
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});
