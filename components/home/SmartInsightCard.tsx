import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import usePriceFormatter from "@/hooks/usePriceFormatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";

interface SmartInsightProps {
  remaining: number
}


function SmartInsightCard({ remaining }: SmartInsightProps) {
  const { t } = useTranslation();
  const formatCurrency = usePriceFormatter();
  const today = new Date()
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const remainingDays = lastDayOfMonth - today.getDate() + 1
  const dailyAllowance = Math.max(remaining, 0) / remainingDays

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons name="bulb" size={24} color={theme.colors.primaryOrange} />
        </View>
        <Text weight="bold" size="lg">{t("home.dailyTipTitle")}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>
          <Trans
            i18nKey="home.dailyTip"
            values={{ amount: formatCurrency(dailyAllowance) }}
            components={{ bold: <Text weight="bold" /> }}
          />
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm
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
