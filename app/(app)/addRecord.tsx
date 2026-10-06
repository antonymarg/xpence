import * as expenseApi from "@/api/expenses.api";
import CategoryPicker from "@/components/CategoryPicker";
import DatePicker from "@/components/DatePicker";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import useExpenseSummary from "@/hooks/useExpenseSummary";
import useProfile from "@/hooks/useProfile";
import useUserCategories from "@/hooks/useUserCategories";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const schema = z.object({
  amount: z.coerce.number().min(0.01, "Please enter a valid amount"),
  description: z.string().min(1, "Please enter a description"),
  categoryId: z.string().min(1, "Please select a category"),
  date: z.date(),
});

function AddRecordPage() {
  const {
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccess,
    invalidateProfile
  } = useProfile();
  const {
    data: userCategories,
    isLoading: isUserCategoriesLoading,
    isSuccess: isUserCategoriesSuccess,
    invalidateUserCategories
  } = useUserCategories();
  const { invalidateExpenseSummary } = useExpenseSummary();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
      categoryId: "",
      date: new Date(),
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async (data: z.infer<typeof schema>) => {
    const result = await expenseApi.addExpense(data);
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Expense added successfully",
        visibilityTime: 5000,
        autoHide: true,
      });
      await invalidateExpenseSummary();
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        visibilityTime: 5000,
        autoHide: true,
      });
    }
    reset();
  };

  if (isProfileLoading || isUserCategoriesLoading) {
    return (
      <Loading />
    );
  }

  if (!isProfileSuccess || !isUserCategoriesSuccess) {
    const onRefresh = async () => {
      await invalidateProfile()
      await invalidateUserCategories();
    }
    return (
      <ErrorScreen onRefresh={onRefresh} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" color={theme.colors.textLight} size={32} />
        </Pressable>
        <Text size="xl" weight="bold">
          Add Expense
        </Text>
        <Pressable onPress={handleSubmit(handleSave)}>
          <Text size="lg" weight="bold" color="primaryRed">
            Save
          </Text>
        </Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.mainForm}>
          <View style={styles.formSegment}>
            <Text size="sm" weight="bold" heading>
              Amount
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChangeText={(text) =>
                    onChange(text.replace(/[^0-9.]/g, ""))
                  }
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainForm: {
    gap: theme.spacing.md,
  },
  formSegment: {
    gap: theme.spacing.sm,
  },
});

export default AddRecordPage;
