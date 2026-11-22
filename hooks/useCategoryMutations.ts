import * as categoryApi from "@/api/categories.api";
import { unwrap } from "@/lib/utils";
import { Category } from "@/types/categories.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useInvalidateCategories = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ["categories"] });
};

export const useAddCategory = () => {
    const invalidateCategories = useInvalidateCategories();
    return useMutation({
        mutationFn: (category: Pick<Category, "name" | "type">) =>
            unwrap(categoryApi.addUserCategory(category)),
        onSuccess: invalidateCategories,
    });
};

export const useRenameCategory = () => {
    const invalidateCategories = useInvalidateCategories();
    return useMutation({
        mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
            unwrap(categoryApi.renameUserCategory(categoryId, name)),
        onSuccess: invalidateCategories,
    });
};

export const useDeleteCategory = () => {
    const invalidateCategories = useInvalidateCategories();
    return useMutation({
        mutationFn: (categoryId: string) => unwrap(categoryApi.deleteUserCategory(categoryId)),
        onSuccess: invalidateCategories,
    });
};
