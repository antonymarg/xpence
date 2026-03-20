import { theme } from "@/constants/theme";
import { Category } from "@/types/users.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Pressable from "./Pressable";

interface CategoryTypePickerProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

function CategoryPicker({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTypePickerProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => onSelectCategory(category)}
          style={[
            styles.categoryButton,
            selectedCategory?.id === category.id && styles.selectedButton,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory?.id === category.id && styles.selectedText,
            ]}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.textLight,
    backgroundColor: theme.colors.background,
  },
  categoryText: {
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.bold,
  },
  selectedButton: {
    borderColor: theme.colors.primaryRed,
    backgroundColor: theme.colors.primaryRedBg,
  },
  selectedText: {
    color: theme.colors.primaryRed,
  },
});

export default CategoryPicker;
