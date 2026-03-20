import { getSumOfExpenses } from "@/api/expenses.api";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function HomePage() {
  const { profile } = useAuth();

  const [sum, setSum] = React.useState<number>(0);

  React.useEffect(() => {
    getSumOfExpenses().then((r) => {
      if (r.success) setSum(r.data);
    });
  }, []);

  return (
    <View style={styles.pageContainer}>
      <View>
        <Text style={styles.helloText}>Hey, {profile?.displayName}!</Text>
        <Text style={styles.helloText}>{(sum / 100).toString()}!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  helloText: {
    color: theme.colors.textDark,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
});

export default HomePage;
