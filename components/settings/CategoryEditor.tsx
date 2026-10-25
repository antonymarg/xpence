import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Text from "../Text";
import CategoryList from "./CategoryList";

interface CategoryEditorProps {
  categories: Category[];
  onClickDelete: (category: Category) => void;
}

function CategoryEditor({ categories, onClickDelete }: CategoryEditorProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text color="needs" weight="bold">
        {t("categories.needs")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "needs")}
        onClickDelete={onClickDelete}
      />
      <Text color="wants" weight="bold">
        {t("categories.wants")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "wants")}
        onClickDelete={onClickDelete}
      />
      <Text color="savings" weight="bold">
        {t("categories.savings")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "savings")}
        onClickDelete={onClickDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
});

export default CategoryEditor;
