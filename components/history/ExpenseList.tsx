import { theme } from "@/constants/theme";
import useExpenses, { type ListItem } from "@/hooks/useExpenses";
import { Category, CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import { InfiniteData } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import Loading from "../Loading";
import Text from "../Text";
import SwipeableExpenseCard from "./SwipeableExpenseCard";

interface ExpenseListProps {
  selectedCategoryType: CategoryType | "all";
  selectedCategory: string | null;
  availableCategories: Category[];
  fromDate: Date;
  toDate: Date;
  onEditExpensePress: (expense: Expense) => void;
  onDeleteExpensePress: (expense: Expense) => void;
}

function formatSectionDate(date: Date, language: string): string {
  return new Intl.DateTimeFormat(language, {
    month: "short",
    day: "numeric",
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
          id: `hdr-${headerTitle}`,
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
        <View style={style.cardWrapper}>
          <SwipeableExpenseCard
            expense={item.data}
            categoryName={category.name}
            categoryType={category.type}
            onEdit={onEditExpensePress}
            onDelete={onDeleteExpensePress}
          />
        </View>
      );
    },
    [availableCategories, onEditExpensePress, onDeleteExpensePress]
  );

  if (isLoading) return <Loading />;

  return (
    <FlatList
      style={style.list}
      contentContainerStyle={style.listContent}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
      ListEmptyComponent={
        <View style={style.empty}>
          <Text>{t("history.noExpenses")}</Text>
        </View>
      }
    />
  );
}

const style = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: theme.spacing.md,
  },
  dateHeader: {
    paddingVertical: theme.spacing.md,
  },
  cardWrapper: {
    marginBottom: theme.spacing.sm
  },
  empty: {
    padding: theme.spacing.xl,
    alignItems: "center"
  },
});