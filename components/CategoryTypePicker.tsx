import { theme } from "@/constants/theme";
import { Category } from "@/types/users.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Pressable from "./Pressable";

interface CategoryTypePickerProps {
  selectedCategoryType: Category["type"] | null;
  onSelectCategoryType: (category: Category["type"]) => void;
}

function CategoryTypePicker({
  selectedCategoryType,
  onSelectCategoryType,
}: CategoryTypePickerProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onSelectCategoryType("needs")}
        style={[
          styles.categoryTypeButton,
          selectedCategoryType === "needs" && styles.needsButton,
        ]}
      >
        <Text
          style={[
            styles.categoryTypeText,
            selectedCategoryType === "needs" && styles.needsText,
          ]}
        >
          Needs
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("wants")}
        style={[
          styles.categoryTypeButton,
          selectedCategoryType === "wants" && styles.wantsButton,
        ]}
      >
        <Text
          style={[
            styles.categoryTypeText,
            selectedCategoryType === "wants" && styles.wantsText,
          ]}
        >
          Wants
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("savings")}
        style={[
          styles.categoryTypeButton,
          selectedCategoryType === "savings" && styles.savingsButton,
        ]}
      >
        <Text
          style={[
            styles.categoryTypeText,
            selectedCategoryType === "savings" && styles.savingsText,
          ]}
        >
          Savings
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  categoryTypeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.textLight,
    backgroundColor: theme.colors.background,
  },
  categoryTypeText: {
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.bold,
  },
  needsButton: {
    borderColor: theme.colors.needs,
    backgroundColor: theme.colors.needsBg,
  },
  needsText: {
    color: theme.colors.needs,
  },
  wantsButton: {
    borderColor: theme.colors.wants,
    backgroundColor: theme.colors.wantsBg,
  },
  wantsText: {
    color: theme.colors.wants,
  },
  savingsButton: {
    borderColor: theme.colors.savings,
    backgroundColor: theme.colors.savingsBg,
  },
  savingsText: {
    color: theme.colors.savings,
  },
});

export default CategoryTypePicker;
