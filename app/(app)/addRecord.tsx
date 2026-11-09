import * as expenseApi from "@/api/expenses.api";
import Button from "@/components/Button";
import CategoryPicker from "@/components/CategoryPicker";
import DatePicker from "@/components/DatePicker";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import useUserCategories from "@/hooks/useUserCategories";
import { parseAmountInput } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

function AddRecordPage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = React.useState(false);
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

  const handleSave = async (data: z.infer<typeof schema>) => {
    setIsSaving(true);
    try {
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
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        reset();
      } else {
        Toast.show({
          type: "error",
          text1: t("expense.saveFailed"),
          visibilityTime: 5000,
          autoHide: true,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePress = () => {
    Keyboard.dismiss();
    void handleSubmit(handleSave)();
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text size="title" weight="bold">
        {t("expense.addTitle")}
      </Text>
      <ScrollView style={styles.formScrollView} keyboardShouldPersistTaps="handled">
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
      <View style={styles.saveFooter}>
        <Button
          onPress={handleSavePress}
          background="gradient"
          block
          disabled={isSaving}
          style={styles.saveButton}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="checkmark" size={20} color="white" />
          )}
          <Text weight="bold" color="white">
            {isSaving ? t("common.saving") : t("common.save")}
          </Text>
        </Button>
      </View>
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
  formScrollView: {
    flex: 1,
  },
  mainForm: {
    gap: theme.spacing.md,
  },
  formSegment: {
    gap: theme.spacing.sm,
  },
  saveFooter: {
    paddingTop: theme.spacing.sm,
  },
  saveButton: {
    gap: theme.spacing.sm,
  },
});

export default AddRecordPage;
