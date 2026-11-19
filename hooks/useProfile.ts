import * as userApi from "@/api/users.api";
import { unwrap } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useProfile = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["profile"],
        queryFn: () => unwrap(userApi.getUserProfile()),
        staleTime: 1000 * 60 * 5,
    });

    const invalidateProfile = async () => {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
    }

    return {
        ...query,
        invalidateProfile
    }
}

export default useProfile;
