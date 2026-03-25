import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { CategoryType } from "@/types/users.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import ProgressBar from "../ProgressBar";

interface CategoryCardProps {
  category: CategoryType;
  percentage: number;
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

function CategoryCard({ category, percentage }: CategoryCardProps) {
  const [color, icon, categoryPercentage] = getIconForCategory(category);
  const styling = styles(category);
  return (
    <Card style={styling.container}>
      <View style={styling.header}>
        <View style={styling.iconWrapper}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text weight="bold" size="lg" style={styling.percentageText}>
          {isNaN(percentage) ? "-" : percentage.toFixed(0) + "%"}
        </Text>
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
    container: {},
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: theme.spacing.md,
    },
    iconWrapper: {
      backgroundColor: theme.colors[`${category}Bg`],
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    percentageText: {
      color: theme.colors[`${category}`],
    },
    labelText: {
      paddingBottom: theme.spacing.sm,
    },
  });

export default CategoryCard;
