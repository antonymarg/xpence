import { theme } from "@/constants/theme";
import { toLocalDateString } from "@/lib/utils";
import useExpenses, { type ListItem } from "@/hooks/useExpenses";
import { Category, CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import { InfiniteData } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import Loading from "../Loading";
import Text from "../Text";
import ExpenseCard from "./ExpenseCard";

interface ExpenseListProps {
  selectedCategoryType: CategoryType | "all";
  selectedCategory: string | null;
  availableCategories: Category[];
  fromDate?: Date;
  toDate?: Date;
  onEditExpensePress: (expense: Expense) => void;
  onDeleteExpensePress: (expense: Expense) => void;
}

// Shows the year only for dates outside the current year ("8 Nov" vs "8 Nov 2025").
function formatSectionDate(date: Date, language: string): string {
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat(language, {
    month: "short",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  }).format(date);
}

export default function ExpenseList({
  selectedCategoryType,
  selectedCategory,
  availableCategories,
  fromDate,
  toDate,
  onEditExpensePress,
  onDeleteExpensePress,
}: ExpenseListProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const transformData = useCallback((data: InfiniteData<Expense[]>) => {
    const expenses = data.pages.flat();
    if (!expenses.length) return [];

    const items: ListItem[] = [];
    let lastHeader = "";

    for (let index = 0; index < expenses.length; index++) {
      const expense = expenses[index];
      const headerTitle = formatSectionDate(expense.date, language);

      if (headerTitle !== lastHeader) {
        lastHeader = headerTitle;
        items.push({
          type: "header",
          id: `hdr-${toLocalDateString(expense.date)}`,
          title: headerTitle,
        });
      }

      items.push({
        type: "expense",
        id: expense.id,
        data: expense,
      });
    }

    return items;
  }, [language]);
  const {
    data: items = [],
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useExpenses({
    selectedCategoryType,
    selectedCategory,
    fromDate,
    toDate,
  }, transformData);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return (
          <Text heading weight="bold" style={style.dateHeader}>
            {item.title}
          </Text>
        );
      }

      const category = availableCategories.find((cat) => cat.id === item.data.categoryId);
      if (!category) return null;

      return (
        <ExpenseCard
          expense={item.data}
          categoryName={category.name}
          categoryType={category.type}
          onEdit={onEditExpensePress}
          onDelete={onDeleteExpensePress}
        />
      );
    },
    [availableCategories, onEditExpensePress, onDeleteExpensePress]
  );

  if (isLoading) return <Loading />;

  return (
    <FlatList
      contentContainerStyle={style.listContent}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshing={isRefetching && !isFetchingNextPage}
      onRefresh={refetch}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <Loading /> : null}
      ListEmptyComponent={
        <View style={style.empty}>
          <Text>{t("history.noExpenses")}</Text>
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  dateHeader: {
    paddingVertical: theme.spacing.sm,
  },
  empty: {
    padding: theme.spacing.xl,
    alignItems: "center"
  },
});