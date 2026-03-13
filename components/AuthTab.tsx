import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Pressable from "./Pressable";


interface AuthTabProps {
  text: string;
  onPress: () => void;
  isActive?: boolean;
}
export default function AuthTab({ text, onPress, isActive }: AuthTabProps) {
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      {isActive && <View style={styles.activeIndicator} />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tab: {},
  text: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.heavy,
    color: theme.colors.textDark,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primaryRed,
    height: 4,
    marginTop: theme.spacing.sm,
  },
});
