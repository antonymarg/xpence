import { theme } from "@/constants/theme";
import React, { useState } from "react";
import {
  BlurEvent,
  FocusEvent,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ITextInputProps extends RNTextInputProps {
  label?: string;
  error?: string | null;
}

export default function TextInput({ label, error, ...props }: ITextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (e: FocusEvent) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const onBlur = (e: BlurEvent) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, isFocused && styles.inputFocused, error && styles.inputError, props.style]}
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textLight,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
  },
  input: {
    padding: theme.spacing.md,
    backgroundColor: "#fff",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  inputFocused: {
    borderColor: theme.colors.needs,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
});
