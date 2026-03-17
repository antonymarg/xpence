import TabBar from "@/components/TabBar";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" />
          <Stack.Screen name="addRecord" />
          <Stack.Screen name="achievements" />
          <Stack.Screen name="insights" />
        </Stack>
      </View>
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
});
