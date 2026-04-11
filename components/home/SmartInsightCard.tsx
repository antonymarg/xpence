import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../Card";

interface SmartInsightProps {}

function SmartInsightCard({}: SmartInsightProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="bulb" size={24} color={theme.colors.primaryOrange} />
      </View>
      <View style={styles.textContainer}>
        <Text weight="bold" size="lg">Smart insight</Text>
        <Text style={styles.mainText}>
          Please spend less you dum dum! Please spend less you dum dum! Please
          spend less you dum dum!
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  iconWrapper: {
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryOrangeBg,
    padding: theme.spacing.sm,
    height: 50,
  },
  mainText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.md,
    paddingBottom: theme.spacing.sm,
  },
});

export default SmartInsightCard;
