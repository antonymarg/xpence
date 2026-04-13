import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../Text";
import CategoryList from "./CategoryList";

interface CategoryEditorProps {
  categories: Category[];
  onClickDelete: (category: Category) => void;
}

function CategoryEditor({ categories, onClickDelete }: CategoryEditorProps) {
  return (
    <View style={styles.container}>
      <Text color="needs" weight="bold">
        Needs
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "needs")}
        onClickDelete={onClickDelete}
      />
      <Text color="wants" weight="bold">
        Wants
      </Text>
      <CategoryList
        categories={categories.filter((cat) => cat.type === "wants")}
        onClickDelete={onClickDelete}
      />
      <Text color="savings" weight="bold">
        Savings
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
