import { useCurrentUser } from "../../features/auth/hooks/useUserQueries";

export const useUser = () => {
	const { data, isLoading, error } = useCurrentUser();

	return {
		user: data?.data,
		isLoading,
		error,
		data,
	};
};
