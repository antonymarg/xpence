import AuthWrapper from "@/components/AuthWrapper";
import DividerText from "@/components/DividerText";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onLoginPress = async () => {
    if (!email || !password) {
      // Show some error message
      return;
    }
    // Handle login logic here
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) console.log("Error logging in:", error.message);
    setLoading(false);
  };
  const onGooglePress = () => {};

  return (
    <AuthWrapper>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="name@example.com"
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
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
            <Text style={styles.buttonText}>Continue</Text>
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
            style={{ width: 20, height: 20 }}
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
  footerLink: {
    color: theme.colors.primaryRed,
    fontWeight: theme.typography.weights.bold,
  },
});
