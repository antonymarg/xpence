import { Theme, theme } from "@/constants/theme";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface CardOnlyProps {
  padding?: keyof Theme["spacing"];
  borderRadius?: keyof Theme["borderRadius"];
}

type CardProps = PropsWithChildren & ViewProps & CardOnlyProps;

function Card({
  children,
  padding = "md",
  borderRadius = "md",
  ...viewProps
}: CardProps) {
  return (
    <View
      {...viewProps}
      style={[styles({ padding, borderRadius }).container, viewProps.style]}
    >
      {children}
    </View>
  );
}

const styles = ({ padding, borderRadius }: Required<CardOnlyProps>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing[padding],
      borderRadius: theme.borderRadius[borderRadius],
      ...theme.shadows.soft,
    },
  });

export default Card;
