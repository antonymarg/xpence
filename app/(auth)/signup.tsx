import AuthWrapper from "@/components/AuthWrapper";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Signup() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignupPress = async () => {
    if (!email || !password) {
      // Show some error message
      return;
    }
    // Handle signup logic here
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) console.log("Error signing up:", error.message);
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
          onPress={onSignupPress}
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
