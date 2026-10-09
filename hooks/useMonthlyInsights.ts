import * as expenseApi from "@/api/expenses.api";
import { unwrap } from "@/lib/utils";
import { CategoryType } from "@/types/categories.types";
import { useIsFocused } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseMonthlyInsightsParams {
    month: Date
    categoryType: CategoryType | 'all'
}
const getFirstAndLastDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1, 0, 0, 0, 0);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return { firstDay, lastDay };
};

const useMonthlyInsights = ({ month, categoryType }: UseMonthlyInsightsParams) => {
    const isFocused = useIsFocused();
    const queryClient = useQueryClient();

    const { requestParams, dateKeys } = useMemo(() => {
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(month);

        const params: expenseApi.GetInsightsParams = {
            fromDate: firstDay,
            toDate: lastDay,
        };

        if (categoryType !== 'all') {
            params.categoryType = categoryType;
        }

        return {
            requestParams: params,
            dateKeys: {
                from: firstDay.toDateString(),
                to: lastDay.toDateString(),
            },
        };
    }, [month, categoryType]);

    const query = useQuery({
        queryKey: [
            "expenses",
            "summary",
            categoryType,
            requestParams.fromDate.toISOString().split('T')[0],
            requestParams.toDate.toISOString().split('T')[0]
        ],
        queryFn: () => unwrap(expenseApi.getMonthlyInsights(requestParams)),
        staleTime: 1000 * 60 * 5,
        enabled: isFocused
    });

    const invalidateMonthlyInsights = async () => {
        await queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
    }

    return {
        ...query,
        invalidateMonthlyInsights
    }
}

export default useMonthlyInsights;