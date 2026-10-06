import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import BudgetCard from "@/components/settings/BudgetCard";
import ManageCategories from "@/components/settings/ManageCategories";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import useUserCategories from "@/hooks/useUserCategories";
import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

function SettingsPage() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccess,
    invalidateProfile
  } = useProfile();
  const {
    data: userCategories,
    isLoading: isUserCategoriesLoading,
    isSuccess: isUserCategoriesSuccess,
    invalidateUserCategories
  } = useUserCategories();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (isProfileLoading || isUserCategoriesLoading) return <Loading />

  if (!isProfileSuccess || !isUserCategoriesSuccess) {
    const onRefresh = async () => {
      await invalidateProfile()
      await invalidateUserCategories();
    }
    return (
      <ErrorScreen onRefresh={onRefresh} />
    );
  }

  if (!profile) return <Redirect href="/(auth)/login" />

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <View>
        <Text size="title" weight="bold">
          Settings
        </Text>
        <Text size="lg">Personalise your experience</Text>
      </View>
      <Text size="lg" weight="bold">
        Financial Plan
      </Text>
      <BudgetCard budget={profile.budget} />
      <ManageCategories categories={userCategories} />
      <Text size="lg" weight="bold">
        Account
      </Text>
      <Button onPress={signOut} background="transparent" style={styles.footer}>
        <Text color="error" weight="bold">
          Sign out
        </Text>
        <Icon color={theme.colors.error} name="exit" />
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  footer: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SettingsPage;
