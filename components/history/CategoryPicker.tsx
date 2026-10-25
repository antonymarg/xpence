import Button from "@/components/Button";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

interface CategoryPickerProps {
  selectedCategoryType: CategoryType | "all";
  selectedCategory: string | null;
  availableCategories: Category[];
  onSelectCategoryType: (type: CategoryType | "all") => void;
  onSelectCategory: (category: string) => void;
}

function CategoryPicker({
  selectedCategoryType,
  selectedCategory,
  onSelectCategoryType,
  onSelectCategory,
  availableCategories,
}: CategoryPickerProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTypeSelector}
      >
        <Button
          background={selectedCategoryType === "all" ? "gradient" : "gray"}
          onPress={() => onSelectCategoryType("all")}
        >
          <Text
            weight="bold"
            color={selectedCategoryType === "all" ? "white" : "textLight"}
          >
            {t("common.allTypes")}
          </Text>
        </Button>
        <Button
          background={selectedCategoryType === "needs" ? "needs" : "gray"}
          onPress={() => onSelectCategoryType("needs")}
        >
          <Text
            weight="bold"
            color={selectedCategoryType === "needs" ? "white" : "textLight"}
          >
            {t("categories.needs")}
          </Text>
        </Button>
        <Button
          background={selectedCategoryType === "wants" ? "wants" : "gray"}
          onPress={() => onSelectCategoryType("wants")}
        >
          <Text
            weight="bold"
            color={selectedCategoryType === "wants" ? "white" : "textLight"}
          >
            {t("categories.wants")}
          </Text>
        </Button>
        <Button
          background={selectedCategoryType === "savings" ? "savings" : "gray"}
          onPress={() => onSelectCategoryType("savings")}
        >
          <Text
            weight="bold"
            color={selectedCategoryType === "savings" ? "white" : "textLight"}
          >
            {t("categories.savings")}
          </Text>
        </Button>
      </ScrollView>
      {selectedCategoryType !== "all" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.categoryTypeSelector}
        >
          {availableCategories
            .filter((cat) => cat.type === selectedCategoryType)
            .map((cat) => (
              <Button
                onPress={() => onSelectCategory(cat.id)}
                size="sm"
                key={cat.id}
              >
                <Text weight={selectedCategory === cat.id ? "bold" : "regular"}>
                  {cat.name}
                </Text>
              </Button>
            ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  scrollView: {
    flexGrow: 0,
  },
  categoryTypeSelector: {
    gap: theme.spacing.sm,
  },
});

export default CategoryPicker;
