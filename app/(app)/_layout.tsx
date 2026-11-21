import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import TabBar from "@/components/TabBar";
import useProfile from "@/hooks/useProfile";
import { setAppLanguage } from "@/lib/i18n";
import { refreshDailyReminders } from "@/lib/notifications";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { AppState, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useProfile();
  const profileLocale = profile?.locale;

  useEffect(() => {
    if (!profileLocale) return;

    void setAppLanguage(profileLocale).finally(refreshDailyReminders);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refreshDailyReminders();
    });
    return () => subscription.remove();
  }, [profileLocale]);

  if (isProfileLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Loading />
      </SafeAreaView>
    );
  }

  if (isProfileError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorScreen onRefresh={() => void refetchProfile()} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return <Redirect href="/(auth)/onboard" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
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
