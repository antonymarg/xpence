import * as categoryApi from '@/api/categories.api';
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
import useUserCategories from "@/hooks/useUserCategories";
import { Category } from "@/types/categories.types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

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

    if (isCategoriesLoading) return <Loading />
    if (!isCategoriesSuccess) return <ErrorScreen onRefresh={invalidateUserCategories} />

    const onAddCategory = async ({ name, type }: Omit<Category, "id">) => {
        const { success } = await categoryApi.addUserCategory({ name, type });
        if (success) {
            await invalidateUserCategories();
            onCloseAddModal();
            Toast.show({
                type: "success",
                text1: t("settings.categoriesUpdated"),
                visibilityTime: 5000,
                autoHide: true,
            });
        }
    };

    const onCloseDeleteModal = () => setDeleteModalCategory(null);
    const onRenameCategory = async (categoryId: string, name: string) => {
        const { success } = await categoryApi.renameUserCategory(categoryId, name);
        if (success) {
            await invalidateUserCategories();
            setEditModalCategory(null);
            Toast.show({
                type: "success",
                text1: t("settings.categoryUpdated"),
                visibilityTime: 5000,
                autoHide: true,
            });
        }
    };
    const onDeleteCategory = async (categoryId: string) => {
        const { success } = await categoryApi.deleteUserCategory(categoryId);
        if (success) {
            await invalidateUserCategories();
            onCloseDeleteModal();
            Toast.show({
                type: "success",
                text1: t("settings.categoryDeleted"),
                visibilityTime: 5000,
                autoHide: true,
            });
        }
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
        />
        <DeleteCategoryModal
            category={deleteModalCategory}
            onClose={onCloseDeleteModal}
            onConfirm={onDeleteCategory}
        />
        <EditCategoryModal
            category={editModalCategory}
            onClose={() => setEditModalCategory(null)}
            onConfirm={onRenameCategory}
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
    },
    addButton: {
        gap: theme.spacing.sm,
    },
});

export default ManageCategories