import { theme } from "@/constants/theme";
import { Category } from "@/types/users.types";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";

interface DeleteCategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: (categoryId: string) => void;
}

function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  if (!category) return null;

  return (
    <Modal visible={Boolean(category)} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon
            name="warning"
            color={theme.colors.error}
            background={theme.colors.errorBg}
            padding="md"
            size={36}
          />
          <View>
            <Text size="xl" weight="bold" textAlign="center">
              Delete Category
            </Text>
            <Text textAlign="center">
              Are you sure you want to delete this category?
            </Text>
          </View>
          <Button
            onPress={() => onConfirm(category.id)}
            block
            background="primaryRed"
          >
            <Text weight="bold" color="white">
              Delete
            </Text>
          </Button>
          <Button onPress={onClose} block background="icons">
            <Text weight="bold">Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
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
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default DeleteCategoryModal;
