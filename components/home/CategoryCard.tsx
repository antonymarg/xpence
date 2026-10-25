import Text from "@/components/Text";
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
      return [theme.colors.needs, "home", 0.5] as const;
    case "wants":
      return [theme.colors.wants, "heart", 0.3] as const;
    case "savings":
      return [theme.colors.savings, "logo-euro", 0.2] as const;
  }
};

const BUDGET_PER_CATEGORY = {
  needs: 0.5,
  wants: 0.3,
  savings: 0.2
}

function CategoryCard({ category, budget, amount, compact = false }: CategoryCardProps) {
  const { t } = useTranslation();
  const formatCurrency = usePriceFormatter();
  const [color, icon, categoryPercentage] = getIconForCategory(category);
  const goal = BUDGET_PER_CATEGORY[category] * budget
  const percentage = (amount / goal) * 100
  const styling = styles({ category, compact });

  if (compact) return (
    <Card padding='sm' style={styling.compactStyleWrapper} >
      <View style={styling.iconWrapper}>
        <Text style={styling.text}>
          {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
        </Text>
      </View>
      <View style={styling.textContainer}>
        <Text size="sm" weight="bold" color={category} style={styling.compactLabelText}>
          {t(`categories.${category}`)}
        </Text>
        <Text>
          {isNaN(percentage) ? "-" : formatCurrency(amount)}
        </Text>
      </View>
    </Card >)

  return (
    <Card>
      <View style={styling.header}>
        <View style={styling.iconWrapper}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styling.textContainer}>
          <Text weight="bold" size="lg" style={styling.text}>
            {isNaN(percentage) ? "-" : formatCurrency(amount)}
          </Text>
          <Text style={styling.text}>
            {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
          </Text>
        </View>
      </View>
      <Text weight="bold" style={styling.labelText}>
        {t(`categories.${category}`).toLocaleUpperCase()}
      </Text>
      <ProgressBar
        height={10}
        percentage={Math.min(percentage / categoryPercentage, 100)}
        type={category}
      />
    </Card>
  );
}

const styles = ({ category, compact }: { category: CategoryType, compact: boolean }) =>
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
    iconWrapper: {
      backgroundColor: theme.colors[`${category}Bg`],
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    textContainer: {
      alignItems: compact ? 'center' : 'flex-end',
    },
    text: {
      textAlign: 'center',
      color: theme.colors[`${category}`],
    },
    compactLabelText: {
      textAlign: 'center',
    },
    labelText: {
      paddingBottom: theme.spacing.sm,
    },
  });

export default CategoryCard;
