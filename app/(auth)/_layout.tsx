import useAuth from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
