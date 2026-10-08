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

  if (!profile) return <Redirect href="/(auth)/login" />

  const sum =
    expenseSummary.needs + expenseSummary.wants + expenseSummary.savings;
  return (
    <View style={styles.pageContainer}>
      <Header profile={profile} />
      <ScrollView contentContainerStyle={styles.mainContent}>
        <OverviewCard sum={sum} budget={profile.budget} />
        <CategoryCard
          category="needs"
          amount={expenseSummary.wants}
          percentage={(expenseSummary.needs / profile.budget) * 100}
        />
        <View style={styles.categoriesRow}>
          <View style={styles.category}>
            <CategoryCard
              category="wants"
              amount={expenseSummary.needs}
              percentage={(expenseSummary.wants / profile.budget) * 100}
            />
          </View>
          <View style={styles.category}>
            <CategoryCard
              category="savings"
              amount={expenseSummary.savings}
              percentage={(expenseSummary.savings / profile.budget) * 100}
            />
          </View>
        </View>
        <SmartInsightCard />
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
