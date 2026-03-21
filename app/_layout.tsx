import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

const client = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
