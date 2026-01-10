import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getNotifications,
	markAsRead,
	markAllAsRead,
} from "../services/notificationService";
import { getToken } from "../../../shared/utils/helpers";
import { toast } from "react-hot-toast";

export const useNotifications = () => {
	const queryClient = useQueryClient();
	const token = getToken();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
		enabled: !!token,
	});

	const markAsReadMutation = useMutation({
		mutationFn: markAsRead,
		onSuccess: (updatedNotification) => {
			queryClient.setQueryData(["notifications"], (old) => {
				return old.map((n) =>
					n._id === updatedNotification._id ? { ...n, read: true } : n
				);
			});
			queryClient.invalidateQueries(["notifications"]);
		},
		onError: (error) => {
			toast.error("Failed to mark notification as read");
		},
	});

	const markAllAsReadMutation = useMutation({
		mutationFn: markAllAsRead,
		onSuccess: () => {
			queryClient.setQueryData(["notifications"], (old) => {
				return old.map((n) => ({ ...n, read: true }));
			});
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	return {
		notifications,
		isLoading,
		markAsRead: markAsReadMutation.mutate,
		markAllAsRead: markAllAsReadMutation.mutate,
	};
};
