import { theme } from "@/constants/theme";
import React, { useState } from "react";
import {
  BlurEvent,
  FocusEvent,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import Icon, { IconProps } from "./Icon";
import Text from "./Text";

interface ITextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: IconProps['name']
  containerStyle?: ViewProps['style']
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
      {label && (
        <Text heading size="sm" weight="bold" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[
        styles.input,
        isFocused && styles.inputFocused,
        error && styles.inputError,
        props.containerStyle
      ]}>
        <RNTextInput
          {...props}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styles.textInput}
        />
        {props.icon && <Icon name={props.icon} style={styles.icon} />}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: "uppercase",
    marginBottom: theme.spacing.sm,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing.xs,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
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
  icon: {
    marginLeft: 'auto'
  },
  textInput: {
    flex: 1
  }
});
