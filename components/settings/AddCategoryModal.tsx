import { Category } from "@/types/users.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import Button from "../Button";
import CategoryTypePicker from "../CategoryTypePicker";
import Modal from "../Modal";
import Text from "../Text";
import TextInput from "../TextInput";

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (newCat: Omit<Category, "id">) => void;
}

const schema = z.object({
  categoryName: z.string().min(1, "Please enter a name"),
  categoryType: z.enum(["needs", "wants", "savings"]),
});

function AddCategoryModal({
  isVisible,
  onClose,
  onConfirm,
}: AddCategoryModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryName: "",
      categoryType: "needs" as const,
    },
  });

  const handleSave = (data: z.infer<typeof schema>) => {
    onConfirm({
      name: data.categoryName,
      type: data.categoryType,
    });
    reset();
  };

  return (
    <Modal visible={Boolean(isVisible)} onClose={onClose}>
      <Text size="xl" weight="bold" textAlign="center">
        Add new category
      </Text>
      <Text size="sm" weight="bold" heading>
        Name
      </Text>
      <Controller
        control={control}
        name="categoryName"
        render={({ field }) => (
          <TextInput
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            error={errors.categoryName?.message}
          />
        )}
      />
      <Text size="sm" weight="bold" heading>
        Category Type
      </Text>
      <Controller
        name="categoryType"
        control={control}
        render={({ field }) => (
          <CategoryTypePicker
            selectedCategoryType={field.value}
            onSelectCategoryType={field.onChange}
          />
        )}
      />
      <Button onPress={handleSubmit(handleSave)} block background="gradient">
        <Text weight="bold" color="white">
          Add Category
        </Text>
      </Button>
      <Button onPress={onClose} block background="icons">
        <Text weight="bold">Close</Text>
      </Button>
    </Modal>
  );
}

export default AddCategoryModal;
