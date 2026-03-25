import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Pressable from "./Pressable";
import Text from "./Text";

interface AuthTabProps {
  text: string;
  onPress: () => void;
  isActive?: boolean;
}
export default function AuthTab({ text, onPress, isActive }: AuthTabProps) {
  return (
    <Pressable onPress={onPress}>
      <Text size="title" weight="heavy">
        {text}
      </Text>
      {isActive && <View style={styles.activeIndicator} />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: theme.colors.primaryRed,
    height: 4,
    marginTop: theme.spacing.sm,
  },
});
