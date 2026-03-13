import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DividerTextProps {
  text: string;
}
export default function DividerText({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  textContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    color: theme.colors.textLight,
    lineHeight: 20,
  },
});
