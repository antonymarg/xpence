import { theme } from "@/constants/theme";
import usePriceFormatter from "@/hooks/usePriceFormatter";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import Pill from "../Pill";
import Text from "../Text";
import ExpenseActionsMenu from "./ExpenseActionsMenu";

interface ExpenseCardProps {
  expense: Expense;
  categoryName: string;
  categoryType: CategoryType;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

function ExpenseCard({
  expense,
  categoryName,
  categoryType,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  const { t } = useTranslation();
  const formatCurrency = usePriceFormatter();

  return (
    <>
      <Card style={styles.container} padding="sm" borderRadius="sm">
        <View style={styles.leftColumn}>
          <Text weight="bold" numberOfLines={2}>{expense.description}</Text>
          <View style={styles.leftSide}>
            <Pill variant={categoryType} label={t(`categories.${categoryType}`)} />
            <Pill variant="generic" label={categoryName} />
          </View>
        </View>
        <View style={styles.rightSide}>
          <Text weight="bold" numberOfLines={1}>
            -{formatCurrency(expense.amount)}
          </Text>
          <ExpenseActionsMenu
            onEdit={() => onEdit(expense)}
            onDelete={() => onDelete(expense)}
          />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  leftColumn: {
    flex: 1,
  },
  leftSide: {
    marginTop: theme.spacing.xs,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm
  },
});

export default ExpenseCard;
