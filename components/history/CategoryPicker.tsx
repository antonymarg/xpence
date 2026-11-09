import Dropdown from "@/components/Dropdown";
import { Category, CategoryType } from "@/types/categories.types";
import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryPickerProps {
  selectedCategoryType: CategoryType | "all";
  selectedCategory: string | null;
  availableCategories: Category[];
  onSelectCategory: (category: string | null) => void;
}

function CategoryPicker({
  selectedCategoryType,
  selectedCategory,
  onSelectCategory,
  availableCategories,
}: CategoryPickerProps) {
  const { t } = useTranslation();

  const options = [
    { label: t("common.allCategories"), value: "all" },
    ...availableCategories
      .filter((category) => selectedCategoryType === "all" || category.type === selectedCategoryType)
      .map((category) => ({ label: category.name, value: category.id })),
  ];

  if (selectedCategoryType === 'all') return null

  return (
    <Dropdown
      options={options}
      value={selectedCategory ?? "all"}
      onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
    />
  );
}

export default CategoryPicker;
