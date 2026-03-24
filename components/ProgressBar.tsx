import { theme } from "@/constants/theme";
import { CategoryType } from "@/types/users.types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
interface ProgressBarProps {
  height: number;
  percentage: number;
  type: CategoryType | "generic";
}

function ProgressBar(props: ProgressBarProps) {
  if (props.type !== "generic") {
    return (
      <View style={styles(props).container}>
        <View style={[styles(props).topBar, styles(props).categoryType]} />
      </View>
    );
  }

  return (
    <View style={styles(props).container}>
      {props.percentage > 100 ? (
        <View style={[styles(props).topBar, styles(props).overLimit]} />
      ) : (
        <LinearGradient
          colors={[theme.colors.mainGradient[1], theme.colors.mainGradient[0]]}
          locations={[0, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles(props).topBar]}
        />
      )}
    </View>
  );
}

const styles = ({ height, percentage, type }: ProgressBarProps) =>
  StyleSheet.create({
    container: {
      height,
      borderRadius: theme.borderRadius.sm,
      backgroundColor:
        type === "generic"
          ? theme.colors.progressBarBg
          : theme.colors[`${type}Bg`],
    },
    topBar: {
      height,
      width: `${percentage}%`,
      borderRadius: theme.borderRadius.sm,
    },
    overLimit: {
      width: "100%",
      backgroundColor: theme.colors.error,
    },
    categoryType: {
      backgroundColor:
        type === "generic" ? "transparent" : theme.colors[`${type}`],
    },
  });

export default ProgressBar;
