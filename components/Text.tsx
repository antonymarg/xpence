import { theme } from "@/constants/theme";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

interface CustomTextProps {
  size: keyof typeof theme.typography.sizes;
  weight: keyof typeof theme.typography.weights;
  heading: boolean;
  color:
    | "error"
    | "needs"
    | "wants"
    | "savings"
    | "success"
    | "warning"
    | "info"
    | "primaryRed"
    | "primaryOrange"
    | "textLight"
    | "white";
}

interface TextProps extends RNTextProps, Partial<CustomTextProps> {}

function Text({
  size = "md",
  weight = "regular",
  heading = false,
  color = "textLight",
  ...props
}: TextProps) {
  return (
    <RNText
      {...props}
      style={[styles({ size, weight, heading, color }).text, props.style]}
    >
      {props.children}
    </RNText>
  );
}

const weightToFontFamily: Record<string, string> = {
  light: theme.typography.fontFamily.regular,
  regular: theme.typography.fontFamily.regular,
  medium: theme.typography.fontFamily.medium,
  bold: theme.typography.fontFamily.bold,
  heavy: theme.typography.fontFamily.heavy,
};

const styles = (props: CustomTextProps) =>
  StyleSheet.create({
    text: {
      fontFamily: weightToFontFamily[props.weight],
      color: props.color === "white" ? "white" : theme.colors[props.color],
      fontSize: theme.typography.sizes[props.size],
      textTransform: props.heading ? "uppercase" : "none",
      lineHeight:
        (props.heading ? 1.2 : 1.5) * theme.typography.sizes[props.size],
      letterSpacing: props.heading
        ? theme.typography.letterSpacing.heading
        : theme.typography.letterSpacing.body,
    },
  });
export default Text;
