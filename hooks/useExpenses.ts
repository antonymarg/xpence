import * as expenseApi from "@/api/expenses.api";
import { unwrap } from "@/lib/utils";
import { CategoryType } from "@/types/categories.types";
import { Expense } from "@/types/expenses.types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export type ListItem =
    | { type: "header"; id: string; title: string }
    | { type: "expense"; id: string; data: Expense };

const PAGE_SIZE = 20;

interface UseExpensesArgs {
    selectedCategoryType: CategoryType | "all";
    selectedCategory: string | null;
    fromDate: Date;
    toDate: Date;
}

function formatSectionDate(date: Date): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = `${months[date.getMonth()]} ${date.getDate()}`;
    return formatted;
}

const useExpenses = (args: UseExpensesArgs) => {
    const queryClient = useQueryClient();
    const query = useInfiniteQuery({
        queryKey: [
            "expenses",
            "history",
            args.selectedCategoryType,
            args.selectedCategory,
            args.fromDate.toISOString().split('T')[0],
            args.toDate.toISOString().split('T')[0],
        ],
        queryFn: ({ pageParam }) =>
            unwrap(
                expenseApi.getExpenses({
                    offSet: pageParam,
                    categoryType:
                        args.selectedCategoryType === "all" ? undefined : args.selectedCategoryType,
                    categoryId: args.selectedCategory,
                    fromDate: args.fromDate,
                    toDate: args.toDate,
                }),
            ),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return lastPageParam + PAGE_SIZE;
        },
        select: (data) => {
            const expenses = data.pages.flat();
            if (!expenses.length) return [];

            const items: ListItem[] = [];
            let lastHeader = "";

            for (let i = 0; i < expenses.length; i++) {
                const expense = expenses[i];
                const headerTitle = formatSectionDate(expense.date);

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
        }
    })

    const invalidateExpenses = async () => {
        await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
    return { ...query, invalidateExpenses }
}

export default useExpenses