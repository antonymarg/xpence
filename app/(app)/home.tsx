import ErrorScreen from "@/components/ErrorScreen";
import CategoryCard from "@/components/home/CategoryCard";
import Header from "@/components/home/Header";
import OverviewCard from "@/components/home/OverviewCard";
import SmartInsightCard from "@/components/home/SmartInsightCard";
import Loading from "@/components/Loading";
import Pressable from "@/components/Pressable";
import { theme } from "@/constants/theme";
import useExpenseSummary from "@/hooks/useExpenseSummary";
import useProfile from "@/hooks/useProfile";
import { CategoryType } from "@/types/categories.types";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

function HomePage() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccess,
    invalidateProfile
  } = useProfile()

  const {
    data: expenseSummary,
    isLoading: isExpenseLoading,
    isSuccess: isExpenseSuccess,
    invalidateExpenseSummary
  } = useExpenseSummary();

  const router = useRouter()

  if (isProfileLoading || isExpenseLoading) return (<Loading />)

  if (!isProfileSuccess || !isExpenseSuccess) {
    const onRefresh = async () => {
      await invalidateProfile()
      await invalidateExpenseSummary();
    };
    return <ErrorScreen onRefresh={onRefresh} />
  }

  if (!profile) return null

  const sum = expenseSummary.needs + expenseSummary.wants + expenseSummary.savings;
  const remaining = profile.budget - sum

  const navigateTo = (categoryType: CategoryType) => router.replace(`/(app)/history/${categoryType}`)

  return (
    <View style={styles.pageContainer}>
      <Header profile={profile} />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <OverviewCard sum={sum} budget={profile.budget} />
        <Pressable onPress={() => navigateTo('needs')}>
          <CategoryCard
            category="needs"
            amount={expenseSummary.needs}
            budget={profile.budget}
          />
        </Pressable>
        <View style={styles.categoriesRow}>
          <View style={styles.category}>
            <Pressable onPress={() => navigateTo('wants')}>
              <CategoryCard
                category="wants"
                amount={expenseSummary.wants}
                budget={profile.budget}
              />
            </Pressable>
          </View>
          <View style={styles.category}>
            <Pressable onPress={() => navigateTo('savings')}>
              <CategoryCard
                category="savings"
                amount={expenseSummary.savings}
                budget={profile.budget}
              />
            </Pressable>
          </View>
        </View>
        <SmartInsightCard remaining={remaining} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
    gap: theme.spacing.sm,
    flexGrow: 1,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  category: {
    flex: 1,
  },
});

export default HomePage;
