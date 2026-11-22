import { theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Pressable from "./Pressable";

interface StylingButtonProps {
  background:
  | "primaryRed"
  | "primaryOrange"
  | "card"
  | "icons"
  | "transparent"
  | "gradient"
  | "needs"
  | "wants"
  | "savings"
  | "gray";
  size: "sm" | "md" | "lg" | "xl";
  block: boolean;
  round: boolean;
}

interface ButtonProps extends Partial<StylingButtonProps>, PropsWithChildren {
  onPress: (e?: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  loading?: boolean;
}

function Button({
  children,
  onPress,
  size = "md",
  block = false,
  background = "card",
  round = false,
  style,
  disabled,
  loading,
}: ButtonProps) {
  const styling = styles({ size, block, background, round });
  const buttonStyle = [styling.button, style];

  const content = loading ? (
    <View>
      <View style={styling.hidden}>{children}</View>
      <ActivityIndicator color="white" style={styling.spinner} />
    </View>
  ) : children;

  return (
    <Pressable onPress={onPress} style={styling.block} disabled={disabled || loading}>
      {background === "gradient" ? (
        <LinearGradient
          colors={theme.colors.mainGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyle}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={buttonStyle}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = ({ block, size, background, round }: StylingButtonProps) => {
  const isGradient = background === "gradient";
  const isTransparent = background === "transparent";

  return StyleSheet.create({
    block: {
      width: block ? "100%" : undefined,
    },
    button: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      padding: theme.spacing[size],
      borderRadius: round ? theme.borderRadius.round : theme.borderRadius[size],
      backgroundColor:
        isGradient || isTransparent ? "transparent" : theme.colors[background],
    },
    hidden: {
      opacity: 0,
    },
    spinner: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  });
};

export default Button;
