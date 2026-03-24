import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import ProgressBar from "../ProgressBar";

interface OverviewCardProps {
  sum: number;
  budget: number;
}

function OverviewCard({ sum, budget }: OverviewCardProps) {
  const remaining = budget - sum;
  const isOverLimit = remaining < 0;
  const percentage = (sum / budget) * 100;
  return (
    <Card padding="lg" borderRadius="md" style={styles.overviewCard}>
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>Monthly Budget Status</Text>
        {isOverLimit && (
          <View style={styles.overLimitContainer}>
            <Text style={styles.overLimitPillText}> Over limit</Text>
          </View>
        )}
      </View>
      <Text style={styles.numberText}>€{sum.toLocaleString()}</Text>
      <View style={styles.remainingContainer}>
        <ProgressBar height={15} percentage={percentage} type="generic" />
        <View style={styles.remainingTextContainer}>
          {isOverLimit ? (
            <Text style={styles.overLimitText}>
              €{(remaining * -1).toFixed(2)} over budget
            </Text>
          ) : (
            <Text style={styles.remainingText}>
              €{remaining.toFixed(2)} remaining
            </Text>
          )}
          <Text style={styles.budgetText}>Budget: €{budget.toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  overviewCard: {},
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  overLimitContainer: {
    backgroundColor: theme.colors.errorBg,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-end",
  },
  remainingContainer: {
    gap: 15,
  },
  remainingTextContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "baseline",
  },
  overLimitPillText: {
    color: theme.colors.error,
    textTransform: "uppercase",
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  titleText: {
    textTransform: "uppercase",
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  numberText: {
    fontSize: theme.typography.sizes.hero,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.lg,
  },
  remainingText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.sm,
  },
  overLimitText: {
    color: theme.colors.error,
    fontWeight: theme.typography.weights.bold,
  },
  budgetText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.sm,
    marginLeft: "auto",
  },
});

export default OverviewCard;
