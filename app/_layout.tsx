import Loading from "@/components/Loading";
import { locales } from "@/constants/locale";
import enTranslations from '@/languages/en.json';
import grTranslations from '@/languages/gr.json';
import { resolveAuthRoute } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter } from "expo-router";
import i18n from 'i18next';
import React, { PropsWithChildren, useEffect } from "react";
import { initReactI18next } from "react-i18next";
import Toast from "react-native-toast-message";

const client = new QueryClient();
const publicPages = [
  "/login",
  "/signup",
];

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

const RootWrapper = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={client}>
    {children}
    <Toast />
  </QueryClientProvider>

}
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const router = useRouter();
  const pathname = usePathname();
  const isOnPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isOnPublicPage && session) return;

      const nextRoute = await resolveAuthRoute(session);
      router.replace(nextRoute);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isOnPublicPage, router]);

  if (!fontsLoaded) return <RootWrapper>
    <Loading />
  </RootWrapper>

  return (
    <RootWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </RootWrapper>
  );
}
