import * as expenseApi from "@/api/expenses.api";
import DatePicker from "@/components/DatePicker";
import CategoryPicker from "@/components/history/CategoryPicker";
import DeleteExpenseyModal from "@/components/history/DeleteExpenseModal";
import ExpenseList from "@/components/history/ExpenseList";
import UpdateExpenseModal from "@/components/history/UpdateExpenseModal";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const getFirstDayOfMonth = () => {
  const date = new Date();
  date.setDate(1);
  return date;
};

const getLastDayOfMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date;
};

function HistoryPage() {
  const { userCategories } = useAuth();
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    CategoryType | "all"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date>(getFirstDayOfMonth());
  const [toDate, setToDate] = useState<Date>(getLastDayOfMonth());
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const queryClient = useQueryClient();

  const onSelectCategoryType = (type: CategoryType | "all") => {
    setSelectedCategoryType(type);
    setSelectedCategory(null);
  };

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const updateExpense = async (expense: Expense) => {
    await expenseApi.updateExpense(expense);
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setExpenseToEdit(null);
  };

  const deleteExpense = async (id: string) => {
    await expenseApi.deleteExpense(id);
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setExpenseToDelete(null);
  };

  return (
    <View style={styles.pageContainer}>
      <View>
        <Text size="title" weight="bold">
          History
        </Text>
        <Text size="lg">Track your spending</Text>
      </View>
      <CategoryPicker
        onSelectCategory={onSelectCategory}
        onSelectCategoryType={onSelectCategoryType}
        selectedCategoryType={selectedCategoryType}
        selectedCategory={selectedCategory}
        availableCategories={userCategories}
      />
      <View style={styles.dateRangeSelector}>
        <DatePicker onChange={setFromDate} value={fromDate} />
        <DatePicker onChange={setToDate} value={toDate} />
      </View>
      <ExpenseList
        availableCategories={userCategories}
        selectedCategoryType={selectedCategoryType}
        selectedCategory={selectedCategory}
        fromDate={fromDate}
        toDate={toDate}
        onEditExpensePress={setExpenseToEdit}
        onDeleteExpensePress={setExpenseToDelete}
      />
      <UpdateExpenseModal
        key={`update-${expenseToEdit?.id}`}
        expense={expenseToEdit}
        onClose={() => setExpenseToEdit(null)}
        onConfirm={updateExpense}
      />
      <DeleteExpenseyModal
        key={`delete-${expenseToDelete?.id}`}
        expense={expenseToDelete}
        onConfirm={deleteExpense}
        onClose={() => setExpenseToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  dateRangeSelector: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
});

export default HistoryPage;
