import * as categoriesApi from "@/api/categories.api";
import { unwrap } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useUserCategories = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: () => unwrap(categoriesApi.getUserCategories()),
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