import { theme } from "@/constants/theme";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal as RNModal,
  ModalProps as RNModalProps,
  StyleSheet,
} from "react-native";

interface ModalProps extends RNModalProps {
  onClose: () => void;
}

function Modal({
  animationType = "fade",
  transparent = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      animationType={animationType}
      transparent={transparent}
      onRequestClose={props.onClose}
      statusBarTranslucent={Platform.OS === "android"}
      navigationBarTranslucent={Platform.OS === "android"}
      {...props}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Pressable onPress={props.onClose} style={styles.modalContainer}>
          <Pressable style={[styles.modalContent, props.style]}>
            {props.children}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    maxHeight: '82%',
    width: "80%",
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
    overflow: 'hidden'
  },
});

export default Modal;
