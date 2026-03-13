import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AlertProps {
  message: string
  type: "success" | "error" | "warning" | "info";
}

const getAlertStyle = (type: AlertProps["type"]) => {
  switch (type) {
    case "success":
      return styles.alertSuccess;
    case "error":
      return styles.alertError;
    case "warning":
      return styles.alertWarning;
    case "info":
      return styles.alertInfo;
  }
};

function Alert({ message, type }: AlertProps) {
  const alertStyle = getAlertStyle(type);
  return (
    <View style={[styles.alert, alertStyle]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    width: "100%",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
  },
  alertSuccess: {
    backgroundColor: theme.colors.successBg,
    borderColor: theme.colors.success,
  },
  alertError: {
    backgroundColor: theme.colors.errorBg,
    borderColor: theme.colors.error,
  },
  alertWarning: {
    backgroundColor: theme.colors.warningBg,
    borderColor: theme.colors.warning,
  },
  alertInfo: {
    backgroundColor: theme.colors.infoBg,
    borderColor: theme.colors.info,
  },
  message: {
    fontSize: theme.typography.sizes.sm,
    paddingLeft: theme.spacing.sm,
    color: theme.colors.textDark,
  },
})

export default Alert;