import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { capitaliseFirst, formatPrice } from "@/lib/utils";
import { CategoryType } from "@/types/categories.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

function CategoryCard({ category, budget, amount, compact }: CategoryCardProps) {
  const [color, icon, categoryPercentage] = getIconForCategory(category);
  const goal = BUDGET_PER_CATEGORY[category] * budget
  const percentage = (amount / goal) * 100
  const styling = styles(category);

  if (compact) return (
    <Card padding='lg' style={styling.compactStyleWrapper} >
      <View style={styling.iconWrapper}>
        <Text style={styling.text}>
          {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
        </Text>
      </View>
      <View>
        <Text weight="bold" color={category} style={styling.compactLabelText}>
          {capitaliseFirst(category)}
        </Text>
        <Text>
          {isNaN(percentage) ? "-" : formatPrice(amount)}
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
            {isNaN(percentage) ? "-" : formatPrice(amount)}
          </Text>
          <Text style={styling.text}>
            {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
          </Text>
        </View>
      </View>
      <Text weight="bold" style={styling.labelText}>
        {category.toLocaleUpperCase()}
      </Text>
      <ProgressBar
        height={10}
        percentage={Math.min(percentage / categoryPercentage, 100)}
        type={category}
      />
    </Card>
  );
}

const styles = (category: CategoryType) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    compactStyleWrapper: {
      gap: theme.spacing.sm,
      alignItems: 'center',
      textAlign: 'center'
    },
    iconWrapper: {
      backgroundColor: theme.colors[`${category}Bg`],
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    textContainer: {
      alignItems: 'flex-end'
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
