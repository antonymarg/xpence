import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import z from "zod";
import Button from "../Button";
import CategoryTypePicker from "../CategoryTypePicker";
import Modal from "../Modal";
import Text from "../Text";
import TextInput from "../TextInput";

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (newCat: Omit<Category, "id">) => void;
}

function AddCategoryModal({
  isVisible,
  onClose,
  onConfirm,
}: AddCategoryModalProps) {
  const { t } = useTranslation();
  const schema = z.object({
    categoryName: z.string().min(1, t("validation.nameRequired")),
    categoryType: z.enum(["needs", "wants", "savings"], { error: t("validation.categoryTypeRequired") }),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryName: "",
      categoryType: "needs" as const,
    },
  });

  const handleSave = (data: z.infer<typeof schema>) => {
    onConfirm({
      name: data.categoryName,
      type: data.categoryType,
    });
    reset();
  };

  const handleSavePress = () => {
    Keyboard.dismiss();
    void handleSubmit(handleSave)();
  };

  return (
    <Modal visible={Boolean(isVisible)} onClose={onClose}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text size="xl" weight="bold" textAlign="center">
          {t("categories.addTitle")}
        </Text>
        <Text size="sm" weight="bold" heading>
          {t("common.name")}
        </Text>
        <Controller
          control={control}
          name="categoryName"
          render={({ field }) => (
            <TextInput
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              value={field.value}
              error={errors.categoryName?.message}
            />
          )}
        />
        <Text size="sm" weight="bold" heading>
          {t("common.categoryType")}
        </Text>
        <Controller
          name="categoryType"
          control={control}
          render={({ field }) => (
            <CategoryTypePicker
              selectedCategoryType={field.value}
              onSelectCategoryType={field.onChange}
            />
          )}
        />
        <Button onPress={handleSavePress} block background="gradient">
          <Text weight="bold" color="white">
            {t("categories.addAction")}
          </Text>
        </Button>
        <Button onPress={onClose} block background="icons">
          <Text weight="bold">{t("common.close")}</Text>
        </Button>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexShrink: 1,
  },
  content: {
    gap: theme.spacing.md,
  },
});

export default AddCategoryModal;
