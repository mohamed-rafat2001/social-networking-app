import {
	useQuery,
	useMutation,
	useQueryClient,
	useInfiniteQuery,
} from "@tanstack/react-query";
import * as userService from "../../profile/services/userService";

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ["currentUser"],
		queryFn: userService.getCurrentUser,
		retry: 0,
		staleTime: 1000 * 60 * 30, // 30 minutes
		gcTime: 1000 * 60 * 60, // 1 hour
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});
};

export const useLogin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.login,
		onSuccess: async () => {
			await queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useSignUp = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.signup,
		onSuccess: async () => {
			await queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: userService.forgotPassword,
	});
};

export const useResetPassword = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.resetPassword,
		onSuccess: async () => {
			await queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useUserProfile = (userId) => {
	return useInfiniteQuery({
		queryKey: ["userProfile", userId],
		queryFn: ({ pageParam = 1 }) => userService.getUserProfile(userId, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || !lastPage.data) return undefined;
			const totalFetched = allPages.flatMap((page) => page.data.posts).length;
			if (totalFetched < lastPage.data.results) {
				return allPages.length + 1;
			}
			return undefined;
		},
		enabled: !!userId,
	});
};

export const useUpdateProfileImage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ formData, onProgress }) =>
			userService.updateProfileImage(formData, onProgress),
		onSuccess: () => {
			queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useDeleteProfileImage = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.deleteProfileImage,
		onSuccess: () => {
			queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries(["currentUser"]);
		},
	});
};
