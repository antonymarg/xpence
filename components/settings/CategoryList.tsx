import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Card from "../Card";
import Icon from "../Icon";
import Pressable from "../Pressable";
import Text from "../Text";

interface CategoryListProps {
  type: Category["type"];
  categories: Category[];
  onClickEdit: (cat: Category) => void;
  onClickDelete: (cat: Category) => void;
}

function CategoryList({ type, categories, onClickEdit, onClickDelete }: CategoryListProps) {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <Card padding="md" style={styles.list}>
        <Text size="sm" color="textSecondaryDark" textAlign="center">
          {t("settings.noCategories")}
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="xs" style={styles.list}>
      {categories.map((category, index) => (
        <View
          key={category.id}
          style={[styles.row, index > 0 && styles.rowDivider]}
        >
          <View style={styles.label}>
            <View style={[styles.dot, { backgroundColor: theme.colors[type] }]} />
            <Text numberOfLines={1} style={styles.name}>
              {category.name}
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => onClickEdit(category)}
              accessibilityRole="button"
              accessibilityLabel={t("common.edit")}
              hitSlop={4}
            >
              <Icon
                name="pencil"
                size={14}
                color={theme.colors.textSecondaryDark}
                background={theme.colors.progressBarBg}
                padding="sm"
              />
            </Pressable>
            <Pressable
              onPress={() => onClickDelete(category)}
              accessibilityRole="button"
              accessibilityLabel={t("common.delete")}
              hitSlop={4}
            >
              <Icon
                name="trash-outline"
                size={14}
                color={theme.colors.error}
                background={theme.colors.errorBg}
                padding="sm"
              />
            </Pressable>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.divider,
  },
  label: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.round,
  },
  name: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
});

export default CategoryList;
