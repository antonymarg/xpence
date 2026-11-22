import Button from "@/components/Button";
import ErrorScreen from '@/components/ErrorScreen';
import Icon from "@/components/Icon";
import Loading from '@/components/Loading';
import AddCategoryModal from "@/components/settings/AddCategoryModal";
import CategoryEditor from "@/components/settings/CategoryEditor";
import DeleteCategoryModal from "@/components/settings/DeleteCategoryModal";
import EditCategoryModal from "@/components/settings/EditCategoryModal";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { useAddCategory, useDeleteCategory, useRenameCategory } from "@/hooks/useCategoryMutations";
import useUserCategories from "@/hooks/useUserCategories";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Category } from "@/types/categories.types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function ManageCategories() {
    const { t } = useTranslation();
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isSuccess: isCategoriesSuccess,
        invalidateUserCategories
    } = useUserCategories(true);
    const [deleteModalCategory, setDeleteModalCategory] = useState<Category | null>(null);
    const [editModalCategory, setEditModalCategory] = useState<Category | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

    const addCategory = useAddCategory();
    const renameCategory = useRenameCategory();
    const deleteCategory = useDeleteCategory();

    if (isCategoriesLoading) return <Loading />
    if (!isCategoriesSuccess) return <ErrorScreen onRefresh={invalidateUserCategories} />

    const onAddCategory = (category: Pick<Category, "name" | "type">) => {
        addCategory.mutate(category, {
            onSuccess: () => {
                onCloseAddModal();
                showSuccessToast(t("settings.categoriesUpdated"));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };

    const onCloseDeleteModal = () => setDeleteModalCategory(null);
    const onRenameCategory = (categoryId: string, name: string) => {
        renameCategory.mutate({ categoryId, name }, {
            onSuccess: () => {
                setEditModalCategory(null);
                showSuccessToast(t("settings.categoryUpdated"));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };
    const onDeleteCategory = (categoryId: string) => {
        deleteCategory.mutate(categoryId, {
            onSuccess: () => {
                onCloseDeleteModal();
                showSuccessToast(t("settings.categoryDeleted"));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };

    const onOpenAddModal = () => {
        setIsAddModalVisible(true);
    };
    const onCloseAddModal = () => setIsAddModalVisible(false);

    return <View style={styles.container}>
        <SettingsHeader label={t("settings.manageCategories")} href="/(app)/settings" />
        <View style={styles.categorySection}>
            <View style={styles.row}>
                <Text size="lg" weight="bold">
                    {t("settings.currentCategories")}
                </Text>
                <Button
                    onPress={onOpenAddModal}
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
                        {t("common.add")}
                    </Text>
                </Button>
            </View>
            <CategoryEditor
                categories={categories}
                onClickEdit={setEditModalCategory}
                onClickDelete={setDeleteModalCategory}
            />
        </View>
        <AddCategoryModal
            isVisible={isAddModalVisible}
            onClose={onCloseAddModal}
            onConfirm={onAddCategory}
            isPending={addCategory.isPending}
        />
        <DeleteCategoryModal
            category={deleteModalCategory}
            onClose={onCloseDeleteModal}
            onConfirm={onDeleteCategory}
            isPending={deleteCategory.isPending}
        />
        <EditCategoryModal
            key={editModalCategory?.id}
            category={editModalCategory}
            onClose={() => setEditModalCategory(null)}
            onConfirm={onRenameCategory}
            isPending={renameCategory.isPending}
        />
    </View>
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        gap: theme.spacing.md,
        flex: 1
    },
    categorySection: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addButton: {
        gap: theme.spacing.xs,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
});

export default ManageCategories