import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";
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
  const { t } = useTranslation();
  if (!category) return null;

  return (
    <Modal visible={Boolean(category)} onClose={onClose}>
      <View style={styles.iconWrapper}>
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
          {t("categories.deleteTitle")}
        </Text>
        <Text textAlign="center">
          {t("categories.deleteConfirmation")}
        </Text>
      </View>
      <Button
        onPress={() => onConfirm(category.id)}
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

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
  },
})

export default DeleteCategoryModal;