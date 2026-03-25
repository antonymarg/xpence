import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/users.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import CategoryTypePicker from "./CategoryTypePicker";
import Pressable from "./Pressable";
import Text from "./Text";

interface CategoryTypePickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  error?: string;
}

function CategoryPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
  error,
}: CategoryTypePickerProps) {
  const [selectedCategoryType, setSelectedCategoryType] =
    React.useState<CategoryType | null>(null);

  const handleSelectType = (type: CategoryType) => {
    onSelectCategory("");
    setSelectedCategoryType(type);
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
    gap: 5,
  },
  categoriesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 5,
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
