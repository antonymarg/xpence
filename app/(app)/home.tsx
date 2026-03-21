import * as expenseApi from "@/api/expenses.api";
import Card from "@/components/Card";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { ExpensesSummary } from "@/types/expenses.types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

function HomePage() {
  const { profile } = useAuth();
  const [expenses, setExpenses] = useState<ExpensesSummary>({
    needs: 0,
    wants: 0,
    savings: 0,
  });

  useEffect(() => {
    expenseApi.getSummaryOfExpenses().then((r) => {
      if (r.success) setExpenses(r.data);
    });
  }, []);

  if (!profile)
    return (
      <View style={styles.pageContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  const sum = expenses.needs + expenses.wants + expenses.savings;
  const remaining = Math.max(0, profile?.budget - sum);

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
              {((expenses.needs / sum) * 100).toFixed(0)}%
            </Text>

            <Text style={styles.labelText}>Needs</Text>
          </View>
        </Card>
        <Card>
          <View style={styles.category}>
            <Text style={[styles.wantsText, styles.percentageText]}>
              {((expenses.wants / sum) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.labelText}>Wants</Text>
          </View>
        </Card>
        <Card>
          <View style={styles.category}>
            <Text style={[styles.savingsText, styles.percentageText]}>
              {((expenses.savings / sum) * 100).toFixed(0)}%
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
