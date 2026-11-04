import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import Icon from "../Icon";
import Pressable from "../Pressable";
import Text from "../Text";

interface CategoryListProps {
  categories: Category[];
  onClickEdit: (cat: Category) => void;
  onClickDelete: (cat: Category) => void;
}

function CategoryList({ categories, onClickEdit, onClickDelete }: CategoryListProps) {
  return (
    <View style={styles.categoriesList}>
      {categories.map((category) => (
        <Card key={category.id} padding="md" style={styles.categoryCard}>
          <Text>{category.name}</Text>
          <View style={styles.actions}>
            <Pressable onPress={() => onClickEdit(category)} accessibilityRole="button">
              <Icon name="create-outline" color={theme.colors.textSecondaryDark} />
            </Pressable>
            <Pressable onPress={() => onClickDelete(category)} accessibilityRole="button">
              <Icon name="close" color={theme.colors.textSecondaryDark} />
            </Pressable>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesList: {
    gap: theme.spacing.sm,
  },
  categoryCard: {
    paddingLeft: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
});

export default CategoryList;
