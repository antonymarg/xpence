import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <View style={styles("needs", false).container}>
      <Pressable
        onPress={() => onSelectCategoryType("needs")}
        style={
          styles("needs", selectedCategoryType === "needs").categoryTypeButton
        }
      >
        <Text color={selectedCategoryType === "needs" ? "white" : "needs"} weight="bold">
          {t("categories.needs")}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("wants")}
        style={
          styles("wants", selectedCategoryType === "wants").categoryTypeButton
        }
      >
        <Text weight="bold" color={selectedCategoryType === "wants" ? "white" : "wants"}>
          {t("categories.wants")}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelectCategoryType("savings")}
        style={
          styles("savings", selectedCategoryType === "savings")
            .categoryTypeButton
        }
      >
        <Text weight="bold" color={selectedCategoryType === "savings" ? "white" : "savings"}>
          {t("categories.savings")}
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
      flexWrap: "nowrap",
    },
    categoryTypeButton: {
      flex: 1,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: isSelected ? theme.colors[category] : theme.colors[`${category}Bg`],
    },
  });

export default CategoryTypePicker;
