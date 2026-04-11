import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "./Text";

interface PillProps {
  variant: "red" | "orange" | "wants" | "needs" | "savings" | "generic";
  label: string;
}

const variantToColors = (variant: PillProps["variant"]) => {
  switch (variant) {
    case "red":
      return [theme.colors.primaryRedBg, "primaryRed"] as const;
    case "orange":
      return [theme.colors.primaryOrangeBg, "primaryOrange"] as const;
    case "wants":
      return [theme.colors.wantsBg, "wants"] as const;
    case "needs":
      return [theme.colors.needsBg, "needs"] as const;
    case "savings":
      return [theme.colors.savingsBg, "savings"] as const;
    default:
      return [theme.colors.icons, "textLight"] as const;
  }
};

function Pill({ label, variant }: PillProps) {
  const [bgColor, textColor] = variantToColors(variant);
  return (
    <View style={styles(bgColor).pill}>
      <Text heading weight="bold" color={textColor} size="sm">
        {label}
      </Text>
    </View>
  );
}

const styles = (bgColor: string) =>
  StyleSheet.create({
    pill: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: bgColor,
    },
  });

export default Pill;
