import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiApp from "../../../shared/api/apiApp";

const getNotifications = async () => {
	const response = await apiApp.get("/notifications");
	return response.data.data;
};

const markAsRead = async (id) => {
	const response = await apiApp.patch(`/notifications/${id}/read`);
	return response.data.data;
};

const markAllAsRead = async () => {
	const response = await apiApp.patch("/notifications/read-all");
	return response.data.data;
};

export const useNotifications = () => {
	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
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
