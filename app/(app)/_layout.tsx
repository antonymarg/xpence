import TapBar from "@/components/TapBar";
import { theme } from "@/constants/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
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
      <TapBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
