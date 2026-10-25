import TabBar from "@/components/TabBar";
import useProfile from "@/hooks/useProfile";
import { setAppLanguage } from "@/lib/i18n";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const profileLocale = profile?.locale;

  useEffect(() => {
    if (profileLocale) void setAppLanguage(profileLocale);
  }, [profileLocale]);

  if (isProfileLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="addRecord" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="history" />
        <Stack.Screen name="insights" />
      </Stack>
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
});
