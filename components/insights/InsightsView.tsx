import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { useInsightsContext } from "@/context/InsightContext";
import useMonthlyInsights from "@/hooks/useMonthlyInsights";
import useProfile from "@/hooks/useProfile";
import { CategoryType } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import ErrorScreen from "../ErrorScreen";
import CategoryCard from "../home/CategoryCard";
import Loading from "../Loading";
import CategoryRanking from "./CategoryRanking";
import TotalCard from "./TotalCard";

interface InsightsViewProps {
    categoryType: CategoryType | "all";
}

const BUDGET_PERCENT_PER_CATEGORY_TYPE = {
    needs: 0.5,
    wants: 0.3,
    savings: 0.2
}


function InsightsView({ categoryType }: InsightsViewProps) {
    const { t } = useTranslation()
    const { month } = useInsightsContext()
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isSuccess: isSuccessProfile,
        invalidateProfile
    } = useProfile()
    const {
        data: monthlyInsights,
        isSuccess: isSuccessMonthlyInsights,
        status: statusForMonthlyInsights,
        invalidateMonthlyInsights
    } = useMonthlyInsights({
        categoryType,
        month
    })
    if (statusForMonthlyInsights === "pending" || isLoadingProfile) return <Loading />

    if (!isSuccessMonthlyInsights || !isSuccessProfile || !profile) {
        const onRefresh = async () => {
            await invalidateProfile()
            await invalidateMonthlyInsights()
        }
        return <ErrorScreen onRefresh={onRefresh} />
    }

    const sum = monthlyInsights.expenseSummary.needs + monthlyInsights.expenseSummary.wants + monthlyInsights.expenseSummary.savings

    if (sum === 0) return <View style={styles.noExpensesContainer}>
        <Text size='lg' textAlign='center'>{t("insights.noExpensesForCategory")}</Text>
    </View>

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
    noExpensesContainer: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    categoryContainer: {
        gap: theme.spacing.sm
    },
    categoryBreakdown: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        width: '100%',
    }
})


export default InsightsView;