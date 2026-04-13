import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Pressable from "./Pressable";
import Text from "./Text";

interface CategoryTypePickerProps {
  selectedCategoryType: Category["type"] | null;
  onSelectCategoryType: (category: Category["type"]) => void;
}

function CategoryTypePicker({
  selectedCategoryType,
  onSelectCategoryType,
}: CategoryTypePickerProps) {
  return (
    <View style={styles("needs", false).container}>
      <Pressable
        onPress={() => onSelectCategoryType("needs")}
        style={
          styles("needs", selectedCategoryType === "needs").categoryTypeButton
        }
      >
        <Text color="needs" weight="bold">
          Needs
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("wants")}
        style={
          styles("wants", selectedCategoryType === "wants").categoryTypeButton
        }
      >
        <Text weight="bold" color="wants">
          Wants
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("savings")}
        style={
          styles("savings", selectedCategoryType === "savings")
            .categoryTypeButton
        }
      >
        <Text weight="bold" color="savings">
          Savings
        </Text>
      </Pressable>
    </View>
  );
}

const styles = (category: CategoryType, isSelected: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    categoryTypeButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: isSelected ? 1 : 0,
      borderColor: theme.colors[category],
      backgroundColor: theme.colors[`${category}Bg`],
    },
  });

export default CategoryTypePicker;
