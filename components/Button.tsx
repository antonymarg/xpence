import { theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";
import {
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
    | "gradient";
  size: "sm" | "md" | "lg" | "xl";
  block: boolean;
  round: boolean;
}

interface ButtonProps extends Partial<StylingButtonProps>, PropsWithChildren {
  onPress: (e?: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
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
}: ButtonProps) {
  const styling = styles({ size, block, background, round });
  const buttonStyle = [styling.button, style];

  return (
    <Pressable onPress={onPress} style={styling.block} disabled={disabled}>
      {background === "gradient" ? (
        <LinearGradient
          colors={theme.colors.mainGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyle}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={buttonStyle}>{children}</View>
      )}
    </Pressable>
  );
}

const styles = ({ block, size, background, round }: StylingButtonProps) => {
  const isGradient = background === "gradient";
  const isTransparent = background === "transparent";

  return StyleSheet.create({
    block: {
      width: block ? "100%" : "auto",
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
  });
};

export default Button;
