import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import CategoryTypePicker from "./CategoryTypePicker";
import Pressable from "./Pressable";
import Text from "./Text";

interface CategoryTypePickerProps {
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
}: CategoryTypePickerProps) {
  const [categoryTypeFilter, setCategoryTypeFilter] =
    React.useState<CategoryType | null>(null);
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const selectedCategoryType = selectedCategory?.type ?? categoryTypeFilter;

  const handleSelectType = (type: CategoryType) => {
    onSelectCategory(null);
    setCategoryTypeFilter(type);
  };

  const filteredCategories = React.useMemo(() => {
    if (!selectedCategoryType) return categories;
    return categories.filter(
      (category) => category.type === selectedCategoryType,
    );
  }, [selectedCategoryType, categories]);

  return (
    <View style={styles.container}>
      <CategoryTypePicker
        selectedCategoryType={selectedCategoryType}
        onSelectCategoryType={handleSelectType}
      />
      {error && (
        <Text size="sm" color="error" style={styles.error}>
          {error}
        </Text>
      )}
      <View style={styles.categoriesContainer}>
        {Boolean(selectedCategoryType) &&
          filteredCategories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              style={[
                styles.categoryButton,
                selectedCategoryId === category.id && styles.selectedButton,
              ]}
            >
              <Text size="sm" weight="bold">
                {category.name}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  categoriesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.primaryOrange,
    backgroundColor: theme.colors.primaryOrangeBg,
  },
  selectedButton: {
    borderWidth: 1,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
});

export default CategoryPicker;
