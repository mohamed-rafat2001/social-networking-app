import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeToken } from "../../../shared/utils/helpers";
import * as userService from "../../profile/services/userService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ["currentUser"],
		queryFn: userService.getCurrentUser,
		retry: false,
		enabled: !!localStorage.getItem("token"),
	});
};

export const useLogin = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.login,
		onSuccess: async (data) => {
			if (data.data?.token) {
				storeToken(data.data.token);
			}
			await queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useSignUp = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.signup,
		onSuccess: async (data) => {
			if (data.data?.token) {
				storeToken(data.data.token);
			}
			await queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useUserProfile = (userId) => {
	return useQuery({
		queryKey: ["userProfile", userId],
		queryFn: () => userService.getUserProfile(userId),
		enabled: !!userId,
	});
};

export const useFollowUser = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: userService.followUser,
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries(["userProfile", userId]);
			queryClient.invalidateQueries(["currentUser"]);

			if (socket && userId && userId !== currentUser?._id) {
				socket.emit("sendNotification", {
					recipientId: userId,
					notification: {
						type: "follow",
						sender: currentUser,
						createdAt: new Date(),
						read: false,
					},
				});
			}
		},
	});
};

export const useUnfollowUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.unfollowUser,
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries(["userProfile", userId]);
			queryClient.invalidateQueries(["currentUser"]);
		},
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
