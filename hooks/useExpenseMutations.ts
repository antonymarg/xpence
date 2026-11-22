import * as expenseApi from "@/api/expenses.api";
import { unwrap } from "@/lib/utils";
import { Expense } from "@/types/expenses.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useInvalidateExpenses = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ["expenses"] });
};

export const useAddExpense = () => {
    const invalidateExpenses = useInvalidateExpenses();
    return useMutation({
        mutationFn: (expense: Omit<Expense, "id">) => unwrap(expenseApi.addExpense(expense)),
        onSuccess: invalidateExpenses,
    });
};

export const useUpdateExpense = () => {
    const invalidateExpenses = useInvalidateExpenses();
    return useMutation({
        mutationFn: (expense: Expense) => unwrap(expenseApi.updateExpense(expense)),
        onSuccess: invalidateExpenses,
    });
};

export const useDeleteExpense = () => {
    const invalidateExpenses = useInvalidateExpenses();
    return useMutation({
        mutationFn: (expenseId: string) => unwrap(expenseApi.deleteExpense(expenseId)),
        onSuccess: invalidateExpenses,
    });
};
