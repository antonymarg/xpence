import { Theme, theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface IconButtonBackgroundProps {
  background: string;
  padding: keyof Theme["spacing"];
}

type IconButtonProps = React.ComponentProps<typeof Ionicons> &
  Partial<IconButtonBackgroundProps>;

function Icon({
  name,
  color,
  size = 16,
  background = "#FFFFFF00",
  padding = "xs",
}: IconButtonProps) {
  return (
    <View style={styles({ background, padding }).iconWrapper}>
      <Ionicons name={name} color={color} size={size} />
    </View>
  );
}

const styles = ({ background, padding }: IconButtonBackgroundProps) =>
  StyleSheet.create({
    iconWrapper: {
      backgroundColor: background,
      borderRadius: theme.borderRadius.round,
      padding: theme.spacing[padding],
    },
  });

export default Icon;
