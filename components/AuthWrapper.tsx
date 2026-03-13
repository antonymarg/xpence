import { theme } from "@/constants/theme";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthTab from "./AuthTab";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const segments = useSegments();
  const router = useRouter();
  const activeTab = segments[1];

  const handleTabPress = (tab: "login" | "signup") => {
    router.replace(`/(auth)/${tab}`);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.tabContainer}>
        <AuthTab
          text="Login"
          isActive={activeTab === "login"}
          onPress={() => handleTabPress("login")}
        />
        <AuthTab
          text="Sign Up"
          isActive={activeTab === "signup"}
          onPress={() => handleTabPress("signup")}
        />
      </View>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  tabContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
