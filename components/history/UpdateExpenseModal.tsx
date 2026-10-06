import { theme } from "@/constants/theme";
import useUserCategories from "@/hooks/useUserCategories";
import { Expense } from "@/types/expenses.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
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

const schema = z.object({
  amount: z.coerce.number().min(0.01, "Please enter a valid amount"),
  description: z.string().min(1, "Please enter a description"),
  categoryId: z.string().min(1, "Please select a category"),
  date: z.date(),
});

function UpdateExpenseModal({
  expense,
  onClose,
  onConfirm,
}: UpdateExpenseModalProps) {
  const { data: userCategories, isSuccess: isUserCategoriesSuccess } = useUserCategories();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: expense?.amount || 10,
      description: expense?.description || "",
      categoryId: expense?.categoryId || "",
      date: expense?.date || new Date(),
    },
  });

  if (!expense || !isUserCategoriesSuccess) return null;

  const handleSave = async (data: z.infer<typeof schema>) => {
    onConfirm({ id: expense?.id, ...data });
    reset();
  };

  return (
    <Modal visible={Boolean(expense)} onClose={onClose}>
      <Text size="xl" weight="bold" textAlign="center">
        Update Expense
      </Text>
      <View style={styles.formSegment}>
        <Text size="sm" weight="bold" heading>
          Amount
        </Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={(text) => onChange(text.replace(/[^0-9.]/g, ""))}
              inputMode="numeric"
              value={String(value)}
              onBlur={onBlur}
              error={errors.amount?.message}
              placeholder="0"
            />
          )}
        />
      </View>
      <View style={styles.formSegment}>
        <Text size="sm" weight="bold" heading>
          Description
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
          Available Categories
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
          Date
        </Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DatePicker onChange={onChange} value={value} />
          )}
        />
        <Text>{errors.date?.message}</Text>
      </View>
      <Button onPress={handleSubmit(handleSave)} block background="gradient">
        <Text weight="bold" color="white">
          Update
        </Text>
      </Button>
      <Button onPress={onClose} block background="icons">
        <Text weight="bold">Close</Text>
      </Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  formSegment: {
    gap: theme.spacing.sm,
  },
});
export default UpdateExpenseModal;
