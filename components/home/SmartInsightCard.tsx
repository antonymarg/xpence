import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";

interface SmartInsightProps {
  remaining: number
}


function SmartInsightCard({ remaining }: SmartInsightProps) {
  const { t } = useTranslation();
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  const remainingDays = endOfMonth.getDate() - today.getDate()
  return (
    <Card style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="bulb" size={24} color={theme.colors.primaryOrange} />
      </View>
      <View style={styles.textContainer}>
        <Text weight="bold" size="lg">{t("home.dailyTipTitle")}</Text>
        <Text style={styles.mainText}>
          {t("home.dailyTip", { amount: formatPrice(remaining / remainingDays) })}
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
