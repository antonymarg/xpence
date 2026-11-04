import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import Text from "../Text";
import CategoryList from "./CategoryList";

interface CategoryEditorProps {
  categories: Category[];
  onClickEdit: (category: Category) => void;
  onClickDelete: (category: Category) => void;
}

function CategoryEditor({ categories, onClickEdit, onClickDelete }: CategoryEditorProps) {
  const { t } = useTranslation();
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text color="needs" weight="bold">
        {t("categories.needs")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "needs")}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
      <Text color="wants" weight="bold">
        {t("categories.wants")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "wants")}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
      <Text color="savings" weight="bold">
        {t("categories.savings")}
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "savings")}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
});

export default CategoryEditor;
