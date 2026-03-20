import * as expenseApi from "@/api/expenses.api";
import { getUserCategories } from "@/api/users.api";
import CategoryPicker from "@/components/CategoryPicker";
import CategoryTypePicker from "@/components/CategoryTypePicker";
import DatePicker from "@/components/DatePicker";
import Pressable from "@/components/Pressable";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import { useAuth } from "@/providers/AuthProvider";
import { Category } from "@/types/users.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

function AddRecordPage() {
  const { profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    Category["type"] | null
  >("needs");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchUserCategories = async () => {
      if (!profile) return;
      try {
        const result = await getUserCategories(profile.userId);
        if (!result.success) {
          console.error("Error fetching user categories:", result.error);
          return;
        }
        setCategories(result.data);
      } catch (error) {
        console.error("Error fetching user categories:", error);
      }
    };
    fetchUserCategories();
  }, [profile]);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!amount || amount < 0) return;
    if (!selectedCategory) return;
    if (!description) return;
    await expenseApi.addExpense(
      {
        categoryId: selectedCategory.id,
        amount,
        description,
        date,
      },
      profile?.userId as string,
    );
  };

  const onSelectCategoryType = (type: Category["type"]) => {
    setSelectedCategoryType(type);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.header}>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" color={theme.colors.textLight} size={32} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <Pressable onPress={handleSave}>
          <Text style={styles.headerSave}>Save</Text>
        </Pressable>
      </View>
      <View style={styles.mainForm}>
        <View style={styles.formSegment}>
          <Text style={styles.titleText}>Amount</Text>
          <TextInput
            value={amount.toString()}
            onChangeText={(text) => setAmount(parseFloat(text))}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formSegment}>
          <Text style={styles.titleText}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} />
        </View>
        <View style={styles.formSegment}>
          <Text style={styles.titleText}>Expense type</Text>
          <CategoryTypePicker
            selectedCategoryType={selectedCategoryType}
            onSelectCategoryType={onSelectCategoryType}
          />
        </View>
        <View style={styles.formSegment}>
          <Text style={styles.titleText}>Available Categories</Text>
          <CategoryPicker
            categories={categories.filter(
              (cat) => cat.type === selectedCategoryType,
            )}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
        <View style={styles.formSegment}>
          <Text style={styles.titleText}>Date</Text>
          <DatePicker value={date} onChange={setDate} />
        </View>
      </View>
    </View>
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
