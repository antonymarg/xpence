import * as categoryApi from "@/api/categories.api";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import AddCategoryModal from "@/components/settings/AddCategoryModal";
import CategoryEditor from "@/components/settings/CategoryEditor";
import DeleteCategoryModal from "@/components/settings/DeleteCategoryModal";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

interface ManageCategoriesProps {
  categories: Category[];
}

function ManageCategories({ categories }: ManageCategoriesProps) {
  const queryClient = useQueryClient();

  const [deleteModalCategory, setDeleteModalCategory] =
    useState<Category | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  const onAddCategory = async ({ name, type }: Omit<Category, "id">) => {
    const { success } = await categoryApi.addUserCategory({ name, type });
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onCloseAddModal();
      Toast.show({
        type: "success",
        text1: "Category added successfully",
        visibilityTime: 5000,
        autoHide: true,
      });
    }
  };

  const onCloseDeleteModal = () => setDeleteModalCategory(null);
  const onDeleteCategory = async (categoryId: string) => {
    const { success } = await categoryApi.deleteUserCategory(categoryId);
    if (success) {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onCloseDeleteModal();
      Toast.show({
        type: "success",
        text1: "Category deleted successfully",
        visibilityTime: 5000,
        autoHide: true,
      });
    }
  };

  const onCloseAddModal = () => setIsAddModalVisible(false);

  return (
    <>
      <View>
        <View style={styles.row}>
          <Text size="lg" weight="bold">
            Manage Categories
          </Text>
          <Button
            onPress={() => setIsAddModalVisible(true)}
            background="transparent"
            size="sm"
            style={styles.addButton}
          >
            <Icon
              name="add"
              size={12}
              color="white"
              background={theme.colors.primaryOrange}
              padding="xs"
            />
            <Text weight="bold" color="primaryOrange">
              Add
            </Text>
          </Button>
        </View>
        <CategoryEditor
          categories={categories}
          onClickDelete={setDeleteModalCategory}
        />
      </View>
      <AddCategoryModal
        isVisible={isAddModalVisible}
        onClose={onCloseAddModal}
        onConfirm={onAddCategory}
      />
      <DeleteCategoryModal
        category={deleteModalCategory}
        onClose={onCloseDeleteModal}
        onConfirm={onDeleteCategory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    gap: theme.spacing.sm,
  },
});

export default ManageCategories;
