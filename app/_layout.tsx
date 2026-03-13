import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  // Root must always render the navigator on first paint so navigation works.
  // Auth redirects are handled declaratively in index and in (app)/(auth) layouts.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
