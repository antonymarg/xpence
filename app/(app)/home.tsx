import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function HomePage() {
  const { profile } = useAuth();

  return (
    <View>
      <View>
        <Text style={styles.helloText}>Hey, {profile?.displayName}!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helloText: {
    color: theme.colors.textDark,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
});

export default HomePage;
