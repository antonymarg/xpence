import * as expenseApi from "@/api/expenses.api";
import CategoryPicker from "@/components/CategoryPicker";
import DatePicker from "@/components/DatePicker";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import useExpenseSummary from "@/hooks/useExpenseSummary";
import useProfile from "@/hooks/useProfile";
import useUserCategories from "@/hooks/useUserCategories";
import { parseAmountInput } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

function AddRecordPage() {
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
  const {
    data: profile,
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
      amount: "",
      description: "",
      categoryId: "",
      date: new Date(),
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async (data: z.infer<typeof schema>) => {
    const result = await expenseApi.addExpense({
      ...data,
      amount: Math.round(Number(data.amount) * 100),
    });
    if (result.success) {
      Toast.show({
        type: "success",
        text1: t("expense.expenseAdded"),
        visibilityTime: 5000,
        autoHide: true,
      });
      await invalidateExpenseSummary();
    } else {
      Toast.show({
        type: "error",
        text1: t("expense.saveFailed"),
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
          {t("expense.addTitle")}
        </Text>
        <Pressable onPress={handleSubmit(handleSave)}>
          <Text size="lg" weight="bold" color="primaryRed">
            {t("common.save")}
          </Text>
        </Pressable>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.mainForm}>
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
