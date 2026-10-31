import ErrorScreen from "@/components/ErrorScreen";
import CategoryCard from "@/components/home/CategoryCard";
import Header from "@/components/home/Header";
import OverviewCard from "@/components/home/OverviewCard";
import SmartInsightCard from "@/components/home/SmartInsightCard";
import Loading from "@/components/Loading";
import { theme } from "@/constants/theme";
import useExpenseSummary from "@/hooks/useExpenseSummary";
import useProfile from "@/hooks/useProfile";
import { Redirect } from "expo-router";
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
  if (isProfileLoading || isExpenseLoading) return (<Loading />)

  if (!isProfileSuccess || !isExpenseSuccess) {
    const onRefresh = async () => {
      await invalidateProfile()
      await invalidateExpenseSummary();
    };
    return <ErrorScreen onRefresh={onRefresh} />
  }

  if (!profile) return <Redirect href="/(auth)/(tabs)/login" />

  const sum = expenseSummary.needs + expenseSummary.wants + expenseSummary.savings;
  const remaining = profile.budget - sum

  return (
    <View style={styles.pageContainer}>
      <Header profile={profile} />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <OverviewCard sum={sum} budget={profile.budget} />
        <CategoryCard
          category="needs"
          amount={expenseSummary.needs}
          budget={profile.budget}
        />
        <View style={styles.categoriesRow}>
          <View style={styles.category}>
            <CategoryCard
              category="wants"
              amount={expenseSummary.wants}
              budget={profile.budget}
            />
          </View>
          <View style={styles.category}>
            <CategoryCard
              category="savings"
              amount={expenseSummary.savings}
              budget={profile.budget}
            />
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
    gap: theme.spacing.md,
    flexGrow: 1,
  },
  categoriesRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  category: {
    flex: 1,
  },
});

export default HomePage;
