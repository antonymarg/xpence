import Alert from "@/components/Alert";
import AuthWrapper from "@/components/AuthWrapper";
import DividerText from "@/components/DividerText";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, View } from "react-native";

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

interface InputState {
  value: string;
  error: string | null;
}

export default function Login() {
  const [email, setEmail] = React.useState<InputState>({ value: "", error: null });
  const [password, setPassword] = React.useState<InputState>({ value: "", error: null });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const onLoginPress = async () => {
    setError(null);
    Keyboard.dismiss();
    if(!email.value) {
      setEmail({ value: email.value, error: "Email is required" });
      return;
    }
    if(!EMAIL_REGEX.test(email.value)) {
      setEmail({ value: email.value, error: "Invalid email" });
      return;
    }
    if(!password.value) {
      setPassword({ value: password.value, error: "Password is required" });
      return;
    }
    setLoading(true);
    setEmail({ value: email.value, error: null });
    setPassword({ value: password.value, error: null });

    try{
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value,
      });
      if (loginError) {
        setError(loginError.message);
      }
    } catch {
      setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  const onGooglePress = () => {};

  return (
    <AuthWrapper>
      {error && <Alert message={error} type="error" />}
      <View style={styles.inputContainer}>
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
        <Pressable
          disabled={loading}
          onPress={onLoginPress}
        >
          <LinearGradient
            colors={[
              theme.colors.mainGradient[0],
              theme.colors.mainGradient[1],
            ]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
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
          <Text style={[styles.buttonText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerQuestion}>New here?</Text>
        <Link href="/(auth)/signup" style={styles.footerLink}>
          Create an account
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
  buttonText: {
    color: "#fff",
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: "auto",
  },
  footerQuestion: {
    color: theme.colors.textLight,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  footerLink: {
    color: theme.colors.primaryRed,
    fontWeight: theme.typography.weights.bold,
  },
});
