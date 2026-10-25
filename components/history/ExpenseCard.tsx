import { theme } from "@/constants/theme";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import Pill from "../Pill";
import Text from "../Text";

interface ExpenseCardProps {
  expense: Expense;
  categoryName: string;
  categoryType: CategoryType;
}

function ExpenseCard({
  expense,
  categoryName,
  categoryType,
}: ExpenseCardProps) {
  const { t } = useTranslation();
  return (
    <Card style={styles.container}>
      <View>
        <Text weight="bold">{expense.description}</Text>
        <View style={styles.leftSide}>
          <Pill variant={categoryType} label={t(`categories.${categoryType}`)} />
          <Pill variant="generic" label={categoryName} />
        </View>
      </View>
      <View>
        <Text weight="bold" size="lg">
          -€{expense.amount.toFixed(2)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSide: {
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
});

export default ExpenseCard;
