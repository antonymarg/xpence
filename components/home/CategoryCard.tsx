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
      return [theme.colors.needs, "home"] as const;
    case "wants":
      return [theme.colors.wants, "cart"] as const;
    case "savings":
      return [theme.colors.savings, "wallet"] as const;
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
  const [color, icon] = getIconForCategory(category);
  const goal = BUDGET_PER_CATEGORY[category] * budget
  const percentage = (amount / goal) * 100
  const styling = styles({ category, compact });

  if (compact) return (
    <Card padding='sm' style={styling.compactStyleWrapper} >
      <View style={styling.iconWrapper}>
        <Text textAlign='center' color={category}>
          {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
        </Text>
      </View>
      <View style={styling.centerAlign}>
        <Text size="sm" weight="bold" textAlign='center' color={category}>
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
        <Text weight="bold" size="lg" textAlign='center' color={category}>
          {isNaN(percentage) ? "-" : formatCurrency(amount)}
        </Text>
      </View>
      <View style={styling.footerText}>
        <Text weight="bold">
          {t(`categories.${category}`).toLocaleUpperCase()}
        </Text>
        <Text textAlign="center" color={category}>
          {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
        </Text>
      </View>
      <ProgressBar
        height={10}
        percentage={Math.min(percentage, 100)}
        type={category}
      />
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
    centerAlign: {
      alignItems: 'center'
    }
  });

export default CategoryCard;
