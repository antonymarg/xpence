import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from '../assets/logo/xpence-logo.svg';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <Logo height='10%' style={styles.logo} />
      <View style={styles.tabContainer}>
        {children}
      </View>
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
    flex: 3,
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  logo: {
    padding: theme.spacing.md
  }
});
