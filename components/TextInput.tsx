import { theme } from "@/constants/theme";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BlurEvent,
  FocusEvent,
  Pressable,
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
  prefix?: string;
  containerStyle?: ViewProps['style']
}

export default function TextInput({
  label,
  error,
  icon,
  prefix,
  containerStyle,
  ...props
}: ITextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t } = useTranslation();

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
        containerStyle
      ]}>
        {prefix && (
          <Text size="md" color="textSecondaryDark" style={styles.prefix}>
            {prefix}
          </Text>
        )}
        <RNTextInput
          {...props}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={props.secureTextEntry && !isPasswordVisible}
          style={[styles.textInput, props.style]}
        />
        {props.secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(isPasswordVisible ? "auth.hidePassword" : "auth.showPassword")}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.passwordToggle}
          >
            <Icon
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              color={theme.colors.textLight}
              size={20}
            />
          </Pressable>
        )}
        {icon && <Icon name={icon} style={styles.icon} />}
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
  passwordToggle: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.sm,
    minWidth: 40,
    minHeight: 40,
  },
  prefix: {
    marginRight: theme.spacing.sm,
    alignSelf: "center",
  },
  textInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textDark,
    padding: 0,
    textAlignVertical: "center",
  }
});
