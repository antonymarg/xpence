import * as expenseApi from "@/api/expenses.api";
import { unwrap } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useExpenseSummary = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["expenses", "summary"],
        queryFn: () => unwrap(expenseApi.getSummaryOfExpenses()),
        staleTime: 1000 * 60 * 5
    });

    const invalidateExpenseSummary = async () => {
        await queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
    }

    return {
        ...query,
        invalidateExpenseSummary
    }
}

export default useExpenseSummary;