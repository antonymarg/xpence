import React from "react";
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleSheet,
} from "react-native";

export default function Pressable({
  style,
  children,
  ...rest
}: RNPressableProps) {
  return (
    <RNPressable
      {...rest}
      style={(state) => {
        const { pressed } = state;
        const pressStyle = {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        };
        const userStyle =
          typeof style === "function" ? style(state) : style;
        return StyleSheet.flatten([userStyle, pressStyle]);
      }}
    >
      {children}
    </RNPressable>
  );
}
