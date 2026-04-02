import * as expenseApi from "@/api/expenses.api";
import ErrorScreen from "@/components/ErrorScreen";
import CategoryCard from "@/components/home/CategoryCard";
import Header from "@/components/home/Header";
import OverviewCard from "@/components/home/OverviewCard";
import SmartInsightCard from "@/components/home/SmartInsightCard";
import { theme } from "@/constants/theme";
import { unwrap } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

function HomePage() {
  const { profile, isLoading: isProfileLoading } = useAuth();
  const { refetchQueries } = useQueryClient();
  const { data: expenseSummary, isLoading: isExpenseLoading } = useQuery({
    queryKey: ["expenseSummary"],
    queryFn: () => unwrap(expenseApi.getSummaryOfExpenses()),
  });

  if (isProfileLoading || isExpenseLoading)
    return (
      <View style={[styles.pageContainer, styles.alignCenterContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!profile || !expenseSummary) {
    return (
      <View style={[styles.pageContainer, styles.alignCenterContainer]}>
        <ErrorScreen onRefresh={refetchQueries} />
      </View>
    );
  }

  const sum =
    expenseSummary.needs + expenseSummary.wants + expenseSummary.savings;
  return (
    <View style={styles.pageContainer}>
      <Header profile={profile} />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <OverviewCard sum={sum} budget={profile.budget} />
        <CategoryCard
          category="needs"
          percentage={(expenseSummary.needs / sum) * 100}
        />
        <View style={styles.categoriesRow}>
          <View style={styles.category}>
            <CategoryCard
              category="wants"
              percentage={(expenseSummary.wants / sum) * 100}
            />
          </View>
          <View style={styles.category}>
            <CategoryCard
              category="savings"
              percentage={(expenseSummary.savings / sum) * 100}
            />
          </View>
        </View>
        <SmartInsightCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  alignCenterContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  mainContent: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: 20,
    flexGrow: 1,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 20,
  },
  category: {
    flex: 1,
  },
});

export default HomePage;
