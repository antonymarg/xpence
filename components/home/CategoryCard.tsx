import Text from "@/components/Text";
import { BUDGET_SPLIT } from "@/constants/budgetSplit";
import { theme } from "@/constants/theme";
import usePriceFormatter from "@/hooks/usePriceFormatter";
import { CategoryType } from "@/types/categories.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import ProgressBar from "../ProgressBar";

interface CategoryCardProps {
  category: CategoryType;
  amount: number
  budget: number;
  compact?: boolean
}

const getIconForCategory = (category: CategoryType) => {
  switch (category) {
    case "needs":
      return [theme.colors.needs, "home"] as const;
    case "wants":
      return [theme.colors.wants, "cart"] as const;
    case "savings":
      return [theme.colors.savings, "wallet"] as const;
  }
};

function CategoryCard({ category, budget, amount, compact = false }: CategoryCardProps) {
  const { t } = useTranslation();
  const formatCurrency = usePriceFormatter();
  const [color, icon] = getIconForCategory(category);

  const percentage = budget > 0 ? (amount / budget) * 100 : 0
  const targetPercentage = BUDGET_SPLIT[category] * 100

  const targetAmount = budget * BUDGET_SPLIT[category]
  const progressToTarget = targetAmount > 0 ? (amount / targetAmount) * 100 : 0

  const isOverTarget = category !== "savings" && progressToTarget > 100
  const percentageColor = isOverTarget ? "error" : category
  const percentageLabel = `${percentage.toFixed(0)}%`
  const targetLabel = t("home.target", { percent: targetPercentage })
  const styling = styles({ category, compact });

  if (compact) return (
    <Card padding='sm' style={styling.compactStyleWrapper} >
      <View style={styling.iconWrapper}>
        <Text textAlign='center' color={percentageColor}>
          {percentageLabel}
        </Text>
      </View>
      <View style={styling.centerAlign}>
        <Text size="sm" weight="bold" textAlign='center' color={category}>
          {t(`categories.${category}`)}
        </Text>
        <Text>
          {formatCurrency(amount)}
        </Text>
        <Text size="xs" color="textSecondaryDark" textAlign="center">
          {targetLabel}
        </Text>
      </View>
    </Card >)

  return (
    <Card>
      <View style={styling.header}>
        <View style={styling.iconWrapper}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text weight="bold" size="lg" textAlign='center' color={category}>
          {formatCurrency(amount)}
        </Text>
      </View>
      <View style={styling.footerText}>
        <Text weight="bold">
          {t(`categories.${category}`).toLocaleUpperCase()}
        </Text>
        <Text textAlign="center" color={percentageColor} weight={isOverTarget ? "bold" : "regular"}>
          {percentageLabel}
        </Text>
      </View>
      <ProgressBar
        height={10}
        percentage={Math.min(progressToTarget, 100)}
        overLimit={isOverTarget}
        type={category}
      />
      <Text size="xs" color="textSecondaryDark" textAlign="right" style={styling.targetText}>
        {targetLabel}
      </Text>
    </Card>
  );
}

const styles = ({ category }: { category: CategoryType, compact: boolean }) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    compactStyleWrapper: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.sm,
      alignItems: 'center',
    },
    footerText: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
      justifyContent: 'space-between',
    },
    iconWrapper: {
      backgroundColor: theme.colors[`${category}Bg`],
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    labelText: {
      paddingBottom: theme.spacing.sm,
    },
    targetText: {
      marginTop: theme.spacing.xs,
    },
    centerAlign: {
      alignItems: 'center'
    }
  });

export default CategoryCard;
