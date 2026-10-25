import { theme } from "@/constants/theme";
import { Expense } from "@/types/expenses.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";
import Text from "../Text";

interface DeleteExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
  onConfirm: (expenseId: string) => void;
}

function DeleteExpenseyModal({
  expense,
  onClose,
  onConfirm,
}: DeleteExpenseModalProps) {
  const { t } = useTranslation();
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
          {t("expense.deleteTitle")}
        </Text>
        <Text textAlign="center">
          {t("expense.deleteConfirmation", { description: expense.description })}
        </Text>
      </View>
      <Button
        onPress={() => onConfirm(expense.id)}
        block
        background="primaryRed"
      >
        <Text weight="bold" color="white">
          {t("common.delete")}
        </Text>
      </Button>
      <Button onPress={onClose} block background="icons">
        <Text weight="bold">{t("common.close")}</Text>
      </Button>
    </Modal>
  );
}

export default DeleteExpenseyModal;
