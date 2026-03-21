import * as expenseApi from "@/api/expenses.api";
import Card from "@/components/Card";
import { theme } from "@/constants/theme";
import { unwrap } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function HomePage() {
  const { profile } = useAuth();
  const { data: expenseSummary, isLoading: isExpenseLoading } = useQuery({
    queryKey: ["expenseSummary"],
    queryFn: () => unwrap(expenseApi.getSummaryOfExpenses()),
  });

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
      <View>
        <Text style={styles.helloText}>Hey, {profile?.displayName}!</Text>
      </View>
      <View>
        <Card>
          <View style={styles.sumContainer}>
            <Text style={styles.mainHeader}>Monthly Budget Status</Text>
            <Text>Sum: €{sum.toFixed(2)}</Text>
            <Text>left of €{profile?.budget}</Text>
          </View>
        </Card>
      </View>
      <View style={styles.categoryContainer}>
        <Card>
          <View style={styles.category}>
            <Text style={[styles.needsText, styles.percentageText]}>
              {((expenseSummary.needs / sum) * 100).toFixed(0)}%
            </Text>

            <Text style={styles.labelText}>Needs</Text>
          </View>
        </Card>
        <Card>
          <View style={styles.category}>
            <Text style={[styles.wantsText, styles.percentageText]}>
              {((expenseSummary.wants / sum) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.labelText}>Wants</Text>
          </View>
        </Card>
        <Card>
          <View style={styles.category}>
            <Text style={[styles.savingsText, styles.percentageText]}>
              {((expenseSummary.savings / sum) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.labelText}>Savings</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    // fontSize: theme.typography.sizes.xl,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    gap: 5,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 10,
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
