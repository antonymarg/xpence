import { theme } from "@/constants/theme";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Icon from "../Icon";
import ExpenseCard from "./ExpenseCard";

const ACTION_WIDTH = 80;

interface SwipeableExpenseCardProps {
  expense: Expense;
  categoryName: string;
  categoryType: CategoryType;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

function SwipeableExpenseCard({
  expense,
  categoryName,
  categoryType,
  onEdit,
  onDelete,
}: SwipeableExpenseCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit(expense);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(expense);
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={handleEdit}
      >
        <Icon name="pencil" size={16} color={theme.colors.card} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={handleDelete}
      >
        <Icon name="trash" size={16} color={theme.colors.card} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={2}
    >
      <ExpenseCard
        expense={expense}
        categoryName={categoryName}
        categoryType={categoryType}
      />
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  actionButton: {
    width: ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  editButton: {
    backgroundColor: theme.colors.needs,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
});

export default SwipeableExpenseCard;
