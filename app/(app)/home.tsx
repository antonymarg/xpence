import * as expenseApi from "@/api/expenses.api";
import CategoryCard from "@/components/home/CategoryCard";
import Header from "@/components/home/Header";
import OverviewCard from "@/components/home/OverviewCard";
import SmartInsightCard from "@/components/home/SmartInsightCard";
import { theme } from "@/constants/theme";
import { unwrap } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

function HomePage() {
  const { profile } = useAuth();
  const { data: expenseSummary, isLoading: isExpenseLoading } = useQuery({
    queryKey: ["expenseSummary"],
    queryFn: () => unwrap(expenseApi.getSummaryOfExpenses()),
  });

  console.log(profile, expenseSummary, isExpenseLoading);

  if (!profile || isExpenseLoading || !expenseSummary)
    return (
      <View style={styles.pageContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

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
  mainContent: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: 20,
    flex: 1,
  },
  helloText: {
    color: theme.colors.textDark,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  sumContainer: {
    width: "100%",
    padding: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mainHeader: {
    color: theme.colors.textLight,
    textTransform: "uppercase",
    fontWeight: theme.typography.weights.bold,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: 20,
  },
  category: {
    flex: 1,
  },
  percentageText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
  labelText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
  },
  needsText: {
    color: theme.colors.needs,
  },
  wantsText: {
    color: theme.colors.wants,
  },
  savingsText: {
    color: theme.colors.savings,
  },
});

export default HomePage;
