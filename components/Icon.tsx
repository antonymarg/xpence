import { Theme, theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface IconBackgroundProps {
  background: string;
  padding: keyof Theme["spacing"];
}

type IconProps = React.ComponentProps<typeof Ionicons> &
  Partial<IconBackgroundProps> & {
    style?: ViewProps['style']
  };

function Icon({
  name,
  color,
  size = 16,
  background = "transparent",
  padding = "xs",
  ...props
}: IconProps) {
  return (
    <View style={[styles({ background, padding }).iconWrapper, props.style]}>
      <Ionicons name={name} color={color} size={size} />
    </View>
  );
}

const styles = ({ background, padding }: IconBackgroundProps) =>
  StyleSheet.create({
    iconWrapper: {
      backgroundColor: background,
      borderRadius: theme.borderRadius.round,
      padding: theme.spacing[padding],
    },
  });

export default Icon;
export type { IconProps };

