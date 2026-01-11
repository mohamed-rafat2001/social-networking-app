import { useMemo } from "react";
import { useCurrentUser } from "../../features/auth/hooks/useUserQueries";

export const useUser = () => {
	const { data, isLoading, error } = useCurrentUser();

	return useMemo(
		() => ({
			user: data?.data,
			isLoading,
			error,
			data,
		}),
		[data, isLoading, error]
	);
};
