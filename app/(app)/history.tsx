import * as expenseApi from "@/api/expenses.api";
import DatePicker from "@/components/DatePicker";
import ErrorScreen from "@/components/ErrorScreen";
import CategoryPicker from "@/components/history/CategoryPicker";
import DeleteExpenseyModal from "@/components/history/DeleteExpenseModal";
import ExpenseList from "@/components/history/ExpenseList";
import UpdateExpenseModal from "@/components/history/UpdateExpenseModal";
import Loading from "@/components/Loading";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useExpenses from "@/hooks/useExpenses";
import useUserCategories from "@/hooks/useUserCategories";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const getFirstDayOfMonth = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getLastDayOfMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  date.setHours(23, 59, 59, 999);
  return date;
};

function HistoryPage() {
  const { t } = useTranslation();
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    CategoryType | "all"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date>(getFirstDayOfMonth());
  const [toDate, setToDate] = useState<Date>(getLastDayOfMonth());
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const {
    data: userCategories,
    isLoading: isUserCategoriesLoading,
    isSuccess: isUserCategoriesSuccess,
    invalidateUserCategories
  } = useUserCategories(false);

  const { isLoading: isExpensesLoading, isSuccess: isExpensesSuccess, invalidateExpenses } = useExpenses({
    selectedCategoryType,
    selectedCategory,
    fromDate,
    toDate
  })


  const onSelectCategoryType = (type: CategoryType | "all") => {
    setSelectedCategoryType(type);
    setSelectedCategory(null);
  };

  const onSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const updateExpense = async (expense: Expense) => {
    await expenseApi.updateExpense(expense);
    await invalidateExpenses();
    setExpenseToEdit(null);
  };

  const deleteExpense = async (id: string) => {
    await expenseApi.deleteExpense(id);
    await invalidateExpenses();
    setExpenseToDelete(null);
  };

  if (isUserCategoriesLoading) {
    return (<Loading />)
  }

  if (!isUserCategoriesSuccess || (!isExpensesSuccess && !isExpensesLoading)) {
    return <ErrorScreen onRefresh={invalidateUserCategories} />
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.horizontalPadding}>
        <Text size="title" weight="bold">
          {t("history.title")}
        </Text>
        <Text size="lg">{t("history.subtitle")}</Text>
      </View>
      <View style={styles.horizontalPadding}>

        <CategoryPicker
          onSelectCategory={onSelectCategory}
          onSelectCategoryType={onSelectCategoryType}
          selectedCategoryType={selectedCategoryType}
          selectedCategory={selectedCategory}
          availableCategories={userCategories}
        />
      </View>
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
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  horizontalPadding: {
    paddingHorizontal: theme.spacing.md
  },
  dateRangeSelector: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md
  },
});

export default HistoryPage;
