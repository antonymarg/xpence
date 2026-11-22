import ErrorScreen from "@/components/ErrorScreen";
import CategoryPicker from "@/components/history/CategoryPicker";
import DeleteExpenseyModal from "@/components/history/DeleteExpenseModal";
import ExpenseList from "@/components/history/ExpenseList";
import PeriodPicker from "@/components/history/PeriodPicker";
import UpdateExpenseModal from "@/components/history/UpdateExpenseModal";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useExpenses from "@/hooks/useExpenses";
import { useDeleteExpense, useUpdateExpense } from "@/hooks/useExpenseMutations";
import useUserCategories from "@/hooks/useUserCategories";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface HistoryContentProps {
    categoryType: CategoryType | "all";
}

function HistoryContent({ categoryType }: HistoryContentProps) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    const {
        data: userCategories,
        isLoading: isUserCategoriesLoading,
        isSuccess: isUserCategoriesSuccess,
        invalidateUserCategories
    } = useUserCategories(false);

    const { isLoading: isExpensesLoading, isSuccess: isExpensesSuccess, invalidateExpenses } = useExpenses({
        selectedCategoryType: categoryType,
        selectedCategory,
        fromDate,
        toDate
    });
    const updateExpenseMutation = useUpdateExpense();
    const deleteExpenseMutation = useDeleteExpense();

    const onSelectCategory = (category: string | null) => {
        setSelectedCategory(category);
    };

    const updateExpense = (expense: Expense) => {
        updateExpenseMutation.mutate(expense, {
            onSuccess: () => {
                setExpenseToEdit(null);
                showSuccessToast(t("expense.updated"));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };

    const deleteExpense = (id: string) => {
        deleteExpenseMutation.mutate(id, {
            onSuccess: () => {
                setExpenseToDelete(null);
                showSuccessToast(t("expense.deleted"));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };

    if (isUserCategoriesLoading) {
        return <Loading />;
    }

    if (!isUserCategoriesSuccess || (!isExpensesSuccess && !isExpensesLoading)) {
        const onRefresh = async () => {
            await Promise.all([invalidateUserCategories(), invalidateExpenses()]);
        };
        return <ErrorScreen onRefresh={onRefresh} />;
    }

    return (
        <View style={styles.pageContainer}>
            <View>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => setFiltersVisible((visible) => !visible)}
                    style={styles.filterToggle}
                >
                    <Text weight="bold">
                        {t(filtersVisible ? "history.hideFilters" : "history.showFilters")}
                    </Text>
                    <Icon
                        name={filtersVisible ? "chevron-up-outline" : "chevron-down-outline"}
                        color={theme.colors.textLight}
                    />
                </Pressable>
                {filtersVisible && (
                    <View style={styles.filterContainer}>
                        <CategoryPicker
                            onSelectCategory={onSelectCategory}
                            selectedCategoryType={categoryType}
                            selectedCategory={selectedCategory}
                            availableCategories={userCategories}
                        />
                        <PeriodPicker
                            startDate={fromDate}
                            endDate={toDate}
                            onChange={(startDate, endDate) => {
                                setFromDate(startDate);
                                setToDate(endDate);
                            }}
                        />
                    </View>
                )}
            </View>
            <ExpenseList
                availableCategories={userCategories}
                selectedCategoryType={categoryType}
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
                isPending={updateExpenseMutation.isPending}
            />
            <DeleteExpenseyModal
                key={`delete-${expenseToDelete?.id}`}
                expense={expenseToDelete}
                onConfirm={deleteExpense}
                isPending={deleteExpenseMutation.isPending}
                onClose={() => setExpenseToDelete(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    filterContainer: {
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    filterToggle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: theme.spacing.md,
    },
});

export default HistoryContent;