import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useMonthlyInsights from "@/hooks/useMonthlyInsights";
import useProfile from "@/hooks/useProfile";
import { CategoryType } from "@/types/categories.types";
import { useGlobalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ErrorScreen from "../ErrorScreen";
import CategoryCard from "../home/CategoryCard";
import Loading from "../Loading";
import CategoryRanking from "./CategoryRanking";
import TotalCard from "./TotalCard";

interface InsightsViewProps {
    categoryType: CategoryType | "all";
}

const convertDateStrToDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return new Date()
    return date
}

const BUDGET_PERCENT_PER_CATEGORY_TYPE = {
    needs: 0.5,
    wants: 0.3,
    savings: 0.2
}


function InsightsView({ categoryType }: InsightsViewProps) {
    const { date } = useGlobalSearchParams<{ date: string }>()
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isSuccess: isSuccessProfile,
        invalidateProfile
    } = useProfile()
    const {
        data: monthlyInsights,
        isLoading: isLoadingMonthlyInsights,
        isSuccess: isSuccessMonthlyInsights,
        invalidateMonthlyInsights
    } = useMonthlyInsights({
        categoryType,
        month: convertDateStrToDate(date)
    })

    if (isLoadingMonthlyInsights || isLoadingProfile) return <Loading />

    if (!isSuccessMonthlyInsights || !isSuccessProfile || !profile) {
        const onRefresh = async () => {
            await invalidateProfile()
            await invalidateMonthlyInsights()
        }
        return <ErrorScreen onRefresh={onRefresh} />
    }

    const sum = monthlyInsights.expenseSummary.needs + monthlyInsights.expenseSummary.wants + monthlyInsights.expenseSummary.savings

    if (sum === 0) return <View><Text>No expenses this month</Text></View>

    return (
        <ScrollView contentContainerStyle={styles.pageContainer}>
            <View style={styles.categoryContainer}>
                <TotalCard
                    sum={sum}
                    budget={categoryType === 'all' ? profile.budget : profile.budget * BUDGET_PERCENT_PER_CATEGORY_TYPE[categoryType]}
                />
                {categoryType === 'all' &&
                    <View style={styles.categoryBreakdown}>
                        <CategoryCard
                            compact
                            category="needs"
                            amount={monthlyInsights.expenseSummary.needs}
                            budget={profile.budget}
                        />
                        <CategoryCard
                            compact
                            category="wants"
                            amount={monthlyInsights.expenseSummary.wants}
                            budget={profile.budget}
                        />
                        <CategoryCard
                            compact
                            category="savings"
                            amount={monthlyInsights.expenseSummary.savings}
                            budget={profile.budget}
                        />
                    </View>
                }
            </View>
            <CategoryRanking expenses={monthlyInsights.expenses} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.md
    },
    categoryContainer: {
        gap: theme.spacing.sm
    },
    categoryBreakdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm
    }
})


export default InsightsView;