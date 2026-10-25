import { locales } from "@/constants/locale";
import enTranslations from '@/languages/en.json';
import grTranslations from '@/languages/gr.json';
import { supabase } from "@/lib/supabase";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Href, Stack, useRouter } from "expo-router";
import i18n from 'i18next';
import React, { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import Toast from "react-native-toast-message";

const client = new QueryClient();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      [locales[0].languageTag]: enTranslations,
      [locales[1].languageTag]: grTranslations
    },
    lng: locales[0].languageTag,
    fallbackLng: locales[0].languageTag,
    supportedLngs: locales.map(({ languageTag }) => languageTag),
    interpolation: {
      escapeValue: false,
    },
  })

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log(`>>> AUTH STATE CHANGE: ${new Date().toISOString()}`, event);
      let redirectRoute: Href | null = null;
      if (event === "SIGNED_IN") {
        redirectRoute = "/(app)/home";
      } else if (event === "SIGNED_OUT") {
        redirectRoute = "/(auth)/login";
      }
      if (redirectRoute) router.replace(redirectRoute);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={client}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
