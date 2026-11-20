import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Text from "../Text";
import CategoryList from "./CategoryList";

const SECTIONS = ["needs", "wants", "savings"] as const;

interface CategoryEditorProps {
  categories: Category[];
  onClickEdit: (category: Category) => void;
  onClickDelete: (category: Category) => void;
}

function CategoryEditor({ categories, onClickEdit, onClickDelete }: CategoryEditorProps) {
  const { t } = useTranslation();
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {SECTIONS.map((type) => (
        <View key={type} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text color={type} weight="bold" size="sm" style={styles.sectionTitle}>
              {t(`categories.${type}`)}
            </Text>
            <Text size="sm" color="textSecondaryDark">
              {categories.filter((cat) => cat.type === type).length}
            </Text>
          </View>
          <CategoryList
            type={type}
            categories={categories.filter((cat) => cat.type === type)}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default CategoryEditor;
