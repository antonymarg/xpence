import AuthWrapper from "@/components/AuthWrapper";
import TopBarNavigation from "@/components/TabBarNavigation";
import { theme } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AuthLayout() {
  const { t } = useTranslation();
  return (
    <AuthWrapper>
      <TopBarNavigation
        screenOptions={{
          tabBarActiveTintColor: theme.colors.textLight,
          tabBarInactiveTintColor: theme.colors.textLight,
          tabBarItemStyle: {
            flex: 1,
            paddingHorizontal: 32,
          },
          tabBarStyle: {
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: theme.colors.background
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primaryRed,
            height: 4
          },
          tabBarLabelStyle: {
            fontFamily: theme.typography.fontFamily.heavy,
            fontWeight: theme.typography.weights.heavy,
            fontSize: theme.typography.sizes.title,
            textTransform: 'none',
          }
        }}
      >
        <TopBarNavigation.Screen
          name="login"
          options={{ title: t('auth.loginTab') }}
        />
        <TopBarNavigation.Screen
          name="signup"
          options={{ title: t('auth.signupTab') }}
        />
      </TopBarNavigation>
    </AuthWrapper>
  );
}
