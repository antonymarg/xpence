import * as categoriesApi from "@/api/categories.api";
import { unwrap } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useUserCategories = (onlyActive = true) => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["categories", onlyActive ? "active" : "all"],
        queryFn: () => unwrap(categoriesApi.getUserCategories(onlyActive)),
        staleTime: 1000 * 60 * 5
    });

    const invalidateUserCategories = async () => {
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
    }

    return {
        ...query,
        invalidateUserCategories
    }
}

export default useUserCategories;