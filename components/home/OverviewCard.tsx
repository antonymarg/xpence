import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { formatPrice } from "@/lib/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import ProgressBar from "../ProgressBar";

interface OverviewCardProps {
  sum: number;
  budget: number;
}

function OverviewCard({ sum, budget }: OverviewCardProps) {
  const { t } = useTranslation();
  const remaining = budget - sum;
  const isOverLimit = remaining < 0;
  const percentage = (sum / budget) * 100;
  return (
    <Card padding="lg" borderRadius="md">
      <View style={styles.topContainer}>
        <Text heading weight="bold" size="xs">
          {t("home.monthlyBudgetStatus")}
        </Text>
        {isOverLimit && (
          <View style={styles.overLimitContainer}>
            <Text
              weight="bold"
              size="xs"
              color="error"
              style={styles.overLimitPillText}
            >
              {t("home.overLimit")}
            </Text>
          </View>
        )}
      </View>
      <Text size="hero" weight="bold" style={styles.numberText}>
        {formatPrice(sum)}
      </Text>
      <View style={styles.remainingContainer}>
        <ProgressBar height={15} percentage={percentage} type="generic" />
        <View style={styles.remainingTextContainer}>
          {isOverLimit ? (
            <Text weight="bold" color="error">
              {t("home.overBudget", { amount: formatPrice(Math.abs(remaining)) })}
            </Text>
          ) : (
            <Text size="sm">{t("home.remaining", { amount: formatPrice(remaining) })}</Text>
          )}
          <Text size="sm" style={styles.budgetText}>
            {t("home.budget", { amount: formatPrice(budget) })}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
    gap: theme.spacing.md,
  },
  remainingTextContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignItems: "baseline",
  },
  overLimitPillText: {
    textTransform: "uppercase",
  },
  numberText: {
    marginBottom: theme.spacing.lg,
  },
  budgetText: {
    marginLeft: "auto",
  },
});

export default OverviewCard;
