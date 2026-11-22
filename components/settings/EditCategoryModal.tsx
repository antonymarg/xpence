import { theme } from "@/constants/theme";
import { Category } from "@/types/categories.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import z from "zod";
import Button from "../Button";
import Modal from "../Modal";
import Text from "../Text";
import TextInput from "../TextInput";

interface EditCategoryModalProps {
    category: Category | null;
    onClose: () => void;
    onConfirm: (categoryId: string, name: string) => void;
    isPending?: boolean;
}

function EditCategoryModal({ category, onClose, onConfirm, isPending = false }: EditCategoryModalProps) {
    const { t } = useTranslation();
    const schema = z.object({
        name: z.string().trim().min(1, t("validation.nameRequired")),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: category?.name ?? "" },
    });

    const handleSave = (data: z.infer<typeof schema>) => {
        if (!category) return;
        onConfirm(category.id, data.name);
    };

    const handleSavePress = () => {
        Keyboard.dismiss();
        void handleSubmit(handleSave)();
    };

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal visible={Boolean(category)} onClose={handleClose}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text size="xl" weight="bold" textAlign="center">
                    {t("categories.editTitle")}
                </Text>
                <Text size="sm" weight="bold" heading>
                    {t("common.name")}
                </Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <TextInput
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={errors.name?.message}
                        />
                    )}
                />
                <Button onPress={handleSavePress} disabled={isPending} block background="gradient">
                    <Text weight="bold" color="white">
                        {t("common.save")}
                    </Text>
                </Button>
                <Button onPress={onClose} block background="icons">
                    <Text weight="bold">{t("common.close")}</Text>
                </Button>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexShrink: 1,
    },
    content: {
        gap: theme.spacing.md,
    },
});

export default EditCategoryModal;