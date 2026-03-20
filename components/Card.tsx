import { theme } from "@/constants/theme";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface CardProps extends PropsWithChildren {}
function Card({ children }: CardProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-start",
  },
});

export default Card;
