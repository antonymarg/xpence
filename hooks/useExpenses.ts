import {
    EXPENSE_PAGE_SIZE,
    getExpenses,
    type ExpenseCursor,
} from "@/api/expenses.api";
import { unwrap } from "@/lib/utils";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export type ListItem =
    | { type: "header"; id: string; title: string }
    | { type: "expense"; id: string; data: Expense };

interface UseExpensesArgs {
    selectedCategoryType: CategoryType | "all";
    selectedCategory: string | null;
    fromDate?: Date;
    toDate?: Date;
}

type SelectFn = (data: InfiniteData<Expense[]>) => ListItem[];

const useExpenses = (args: UseExpensesArgs, select?: SelectFn) => {
    const queryClient = useQueryClient();
    const initialPageParam = null as ExpenseCursor | null;
    const query = useInfiniteQuery({
        queryKey: [
            "expenses",
            "history",
            args.selectedCategoryType,
            args.selectedCategory,
            args.fromDate?.toISOString().split("T")[0] ?? null,
            args.toDate?.toISOString().split("T")[0] ?? null,
        ],
        queryFn: ({ pageParam }) =>
            unwrap(
                getExpenses({
                    after: pageParam,
                    categoryType:
                        args.selectedCategoryType === "all"
                            ? undefined
                            : args.selectedCategoryType,
                    categoryId: args.selectedCategory,
                    ...(args.fromDate ? { fromDate: args.fromDate } : {}),
                    ...(args.toDate ? { toDate: args.toDate } : {}),
                }),
            ),
        initialPageParam,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < EXPENSE_PAGE_SIZE) return undefined;
            const lastExpense = lastPage[lastPage.length - 1];
            return { date: lastExpense.date, id: lastExpense.id };
        },
        select,
    });

    const invalidateExpenses = async () => {
        await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    };

    return { ...query, invalidateExpenses };
};

export default useExpenses