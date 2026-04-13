import { theme } from "@/constants/theme";
import { Expense } from "@/types/expenses.types";
import React from "react";
import { View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";
import Text from "../Text";

interface DeleteExpenseyModalProps {
  expense: Expense | null;
  onClose: () => void;
  onConfirm: (expenseId: string) => void;
}

function DeleteExpenseyModal({
  expense,
  onClose,
  onConfirm,
}: DeleteExpenseyModalProps) {
  if (!expense) return null;

  return (
    <Modal visible={Boolean(expense)} onClose={onClose}>
      <View>
        <Icon
          name="warning"
          color={theme.colors.error}
          background={theme.colors.errorBg}
          padding="md"
          size={36}
        />
      </View>
      <View>
        <Text size="xl" weight="bold" textAlign="center">
          Delete Expense
        </Text>
        <Text textAlign="center">
          Are you sure you want to delete "{expense.description}"?
        </Text>
      </View>
      <Button
        onPress={() => onConfirm(expense.id)}
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
    </Modal>
  );
}

export default DeleteExpenseyModal;
