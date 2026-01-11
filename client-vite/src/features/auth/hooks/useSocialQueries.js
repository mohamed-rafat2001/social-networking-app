import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "../../profile/services/userService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useCurrentUser } from "./useUserQueries";

export const useFollowUser = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { data: currentUserData } = useCurrentUser();
	const currentUser = currentUserData?.data;

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

export const useBlockUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.blockUser,
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries(["userProfile", userId]);
			queryClient.invalidateQueries(["currentUser"]);
			queryClient.invalidateQueries(["blockedUsers"]);
		},
	});
};

export const useUnblockUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: userService.unblockUser,
		onSuccess: (_, userId) => {
			queryClient.invalidateQueries(["userProfile", userId]);
			queryClient.invalidateQueries(["currentUser"]);
			queryClient.invalidateQueries(["blockedUsers"]);
		},
	});
};

export const useBlockedUsers = () => {
	return useQuery({
		queryKey: ["blockedUsers"],
		queryFn: userService.getBlockedUsers,
	});
};
