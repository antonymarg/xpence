import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Icon from "@/components/Icon";
import BudgetCard from "@/components/settings/BudgetCard";
import ManageCategories from "@/components/settings/ManageCategories";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

function SettingsPage() {
  const { profile, userCategories, isLoading: isProfileLoading } = useAuth();
  const queryClient = useQueryClient();
  const signOut = () => supabase.auth.signOut();

  if (isProfileLoading)
    return (
      <View style={[styles.pageContainer, styles.alignCenterContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!profile) {
    return (
      <View style={[styles.pageContainer, styles.alignCenterContainer]}>
        <ErrorScreen onRefresh={queryClient.refetchQueries} />
      </View>
    );
  }

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
  alignCenterContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  footer: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SettingsPage;
