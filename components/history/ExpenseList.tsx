import * as expenseApi from "@/api/expenses.api";
import { theme } from "@/constants/theme";
import { unwrap } from "@/lib/utils";
import { Category, CategoryType } from "@/types/users.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, SectionList, StyleSheet, View } from "react-native";
import Text from "../Text";
import ExpenseCard from "./ExpenseCard";

const PAGE_SIZE = 20;

interface ExpenseListProps {
  selectedCategoryType: CategoryType | "all";
  selectedCategory: string | null;
  availableCategories: Category[];
  fromDate: Date;
  toDate: Date;
}

function formatSectionDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const formatted = `${months[date.getMonth()]} ${date.getDate()}`;

  if (isSameDay(date, today)) return `Today, ${formatted}`;
  if (isSameDay(date, yesterday)) return `Yesterday, ${formatted}`;
  return formatted;
}

function ExpenseList({
  selectedCategoryType,
  selectedCategory,
  availableCategories,
  fromDate,
  toDate,
}: ExpenseListProps) {
  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "expenses",
      selectedCategoryType,
      selectedCategory,
      fromDate.toDateString(),
      toDate.toDateString(),
    ],
    queryFn: ({ pageParam }) =>
      unwrap(
        expenseApi.getExpenses({
          offSet: pageParam,
          categoryType:
            selectedCategoryType === "all" ? undefined : selectedCategoryType,
          categoryId: selectedCategory,
          fromDate,
          toDate,
        }),
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + PAGE_SIZE;
    },
  });

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const allExpenses = data?.pages.flat() ?? [];

  if (allExpenses.length === 0) {
    return (
      <View>
        <Text>No expenses found</Text>
      </View>
    );
  }

  const grouped = allExpenses.reduce<Record<string, typeof allExpenses>>(
    (acc, expense) => {
      const key = formatSectionDate(expense.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push(expense);
      return acc;
    },
    {},
  );
  const groupedExpenses = Object.entries(grouped).map(([title, expenses]) => ({
    title,
    data: expenses,
  }));

  return (
    <SectionList
      style={style.list}
      contentContainerStyle={style.listContent}
      sections={groupedExpenses}
      keyExtractor={(item) => item.id}
      initialNumToRender={21}
      refreshing={isLoading}
      onRefresh={refetch}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => {
        const category = availableCategories.find(
          (cat) => cat.id === item.categoryId,
        );
        if (!category) return null;
        return (
          <ExpenseCard
            expense={item}
            categoryName={category.name}
            categoryType={category.type}
          />
        );
      }}
      renderSectionHeader={({ section }) => (
        <Text heading weight="bold" style={style.dateHeader}>
          {section.title}
        </Text>
      )}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" /> : null
      }
    />
  );
}

const style = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: theme.spacing.sm,
  },
  dateHeader: {
    paddingVertical: theme.spacing.md,
  },
});

export default ExpenseList;
