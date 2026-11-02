import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import useUserCategories from "@/hooks/useUserCategories";
import { parseAmountInput } from "@/lib/utils";
import { Expense } from "@/types/expenses.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import z from "zod";
import Button from "../Button";
import CategoryPicker from "../CategoryPicker";
import DatePicker from "../DatePicker";
import Modal from "../Modal";
import Text from "../Text";
import TextInput from "../TextInput";

interface UpdateExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
  onConfirm: (expense: Expense) => void;
}

function UpdateExpenseModal({
  expense,
  onClose,
  onConfirm,
}: UpdateExpenseModalProps) {
  const { t } = useTranslation();
  const schema = z.object({
    amount: z.string().refine(
      (value) => parseAmountInput(value) !== null,
      t("validation.validAmount")
    ),
    description: z.string().min(1, t("validation.descriptionRequired")),
    categoryId: z.string().min(1, t("validation.categoryRequired")),
    date: z.date({ error: t("validation.invalidDate") }),
  });
  const { data: userCategories, isSuccess: isUserCategoriesSuccess } = useUserCategories();
  const { data: profile } = useProfile();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: expense ? String(expense.amount / 100) : "10",
      description: expense?.description || "",
      categoryId: expense?.categoryId || "",
      date: expense?.date || new Date(),
    },
  });

  if (!expense || !isUserCategoriesSuccess) return null;

  const handleSave = async (data: z.infer<typeof schema>) => {
    onConfirm({
      id: expense.id,
      ...data,
      amount: Math.round(Number(data.amount) * 100),
    });
    reset();
  };

  return (
    <Modal visible={Boolean(expense)} onClose={onClose}>
      <Text size="xl" weight="bold" textAlign="center">
        {t("expense.updateTitle")}
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formSegment}>
          <Text size="sm" weight="bold" heading>
            {t("common.amount")}
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                inputMode="decimal"
                value={value}
                onBlur={onBlur}
                error={errors.amount?.message}
                placeholder="0"
                prefix={currencies[profile?.currency ?? "EUR"]}
              />
            )}
          />
        </View>
        <View style={styles.formSegment}>
          <Text size="sm" weight="bold" heading>
            {t("common.description")}
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextInput
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                error={errors.description?.message}
              />
            )}
          />
        </View>
        <View style={styles.formSegment}>
          <Text size="sm" weight="bold" heading>
            {t("expense.availableCategories")}
          </Text>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategoryPicker
                categories={userCategories}
                selectedCategoryId={field.value}
                onSelectCategory={field.onChange}
                error={errors.categoryId?.message}
              />
            )}
          />
        </View>
        <View style={styles.formSegment}>
          <Text size="sm" weight="bold" heading>
            {t("common.date")}
          </Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DatePicker onChange={onChange} value={value} />
            )}
          />
          {errors.date?.message && <Text>{errors.date?.message}</Text>}
        </View>
        <Button onPress={handleSubmit(handleSave)} block background="gradient">
          <Text weight="bold" color="white">
            {t("common.update")}
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
  container: {
    gap: theme.spacing.md
  },
  formSegment: {
    gap: theme.spacing.sm,
  },
});
export default UpdateExpenseModal;
