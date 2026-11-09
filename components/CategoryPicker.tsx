import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import CategoryTypePicker from "./CategoryTypePicker";
import Pressable from "./Pressable";
import Text from "./Text";

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  error?: string;
}

function CategoryPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
  error,
}: CategoryPickerProps) {
  const [categoryTypeFilter, setCategoryTypeFilter] =
    React.useState<CategoryType | null>(null);
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const selectedCategoryType = selectedCategory?.type ?? categoryTypeFilter;

  const handleSelectType = (type: CategoryType) => {
    onSelectCategory("");
    setCategoryTypeFilter(type);
  };

  const filteredCategories = React.useMemo(() => {
    if (!selectedCategoryType) return categories;
    return categories.filter(
      (category) => category.type === selectedCategoryType,
    );
  }, [selectedCategoryType, categories]);

  return (
    <View style={baseStyles.container}>
      <CategoryTypePicker
        selectedCategoryType={selectedCategoryType}
        onSelectCategoryType={handleSelectType}
      />
      {error && (
        <Text size="sm" color="error" style={baseStyles.error}>
          {error}
        </Text>
      )}
      <View style={baseStyles.categoriesContainer}>
        {Boolean(selectedCategoryType) &&
          filteredCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              accessibilityState={{ selected: selectedCategoryId === category.id }}
              style={categoryStyles(category.type, selectedCategoryId === category.id).categoryButton}
            >
              <Text
                size="sm"
                weight="bold"
                color={selectedCategoryId === category.id ? category.type : "textLight"}
                textAlign="center"
              >
                {category.name}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  categoriesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
});

const categoryStyles = (categoryType: CategoryType, isSelected: boolean) =>
  StyleSheet.create({
    categoryButton: {
      width: "48%",
      minHeight: 40,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: isSelected ? theme.colors[categoryType] : "transparent",
      backgroundColor: isSelected ? theme.colors[`${categoryType}Bg`] : theme.colors.background,
    },
  });

export default CategoryPicker;
