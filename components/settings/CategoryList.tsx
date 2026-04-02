import { theme } from "@/constants/theme";
import { Category } from "@/types/users.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import Icon from "../Icon";
import Pressable from "../Pressable";
import Text from "../Text";

interface CategoryListProps {
  categories: Category[];
  onClickDelete: (cat: Category) => void;
}

function CategoryList({ categories, onClickDelete }: CategoryListProps) {
  return (
    <View style={styles.categoriesList}>
      {categories.map((category) => (
        <Card key={category.id} padding="sm" style={styles.categoryCard}>
          <Text>{category.name}</Text>
          <Pressable onPress={() => onClickDelete(category)}>
            <Icon name="close" color={theme.colors.textSecondaryDark} />
          </Pressable>
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
});

export default CategoryList;
