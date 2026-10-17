import { theme } from "@/constants/theme";
import React from "react";
import {
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
      {...props}
    >
      <Pressable onPress={props.onClose} style={styles.modalContainer}>
        <Pressable style={[styles.modalContent, props.style]}>
          {props.children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    width: "80%",
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
    overflow: 'hidden'
  },
});

export default Modal;
