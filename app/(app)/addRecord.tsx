import * as expenseApi from "@/api/expenses.api";
import CategoryPicker from "@/components/CategoryPicker";
import DatePicker from "@/components/DatePicker";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
  const { profile, userCategories } = useAuth();
  const queryClient = useQueryClient();

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
    if (result) {
      Toast.show({
        type: "success",
        text1: "Expense added successfully",
        visibilityTime: 5000,
        autoHide: true,
      });
      queryClient.invalidateQueries({ queryKey: ["expenseSummary"] });
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

  if (!profile || userCategories.length === 0)
    return (
      <View style={styles.formContainer}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" color={theme.colors.textLight} size={32} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <Pressable onPress={handleSubmit(handleSave)}>
          <Text style={styles.headerSave}>Save</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.mainForm}>
          <View style={styles.formSegment}>
            <Text style={styles.titleText}>Amount</Text>
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
            <Text style={styles.titleText}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.description?.message}
                />
              )}
            />
          </View>
          <View style={styles.formSegment}>
            <Text style={styles.titleText}>Available Categories</Text>
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
            <Text style={styles.titleText}>Date</Text>
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
    backgroundColor: theme.colors.background,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textDark,
  },
  headerSave: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primaryRed,
  },
  titleText: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
  },
  mainForm: {
    gap: 20,
  },
  formSegment: {
    gap: 10,
  },
});

export default AddRecordPage;
