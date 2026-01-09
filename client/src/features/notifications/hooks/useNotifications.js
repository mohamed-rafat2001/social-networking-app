import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import apiApp from "../../../shared/api/apiApp";
import { useSocket } from "../../../providers/SocketProvider";

const getNotifications = async () => {
	const response = await apiApp.get("/notifications");
	return response.data.data;
};

const markAsRead = async (id) => {
	const response = await apiApp.patch(`/notifications/${id}/read`);
	return response.data.data;
};

export const useNotifications = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
	});

	useEffect(() => {
		if (!socket) return;

		socket.on("getNotification", (notification) => {
			queryClient.setQueryData(["notifications"], (old) => {
				if (!old) return [notification];
				return [notification, ...old];
			});
		});

		return () => {
			socket.off("getNotification");
		};
	}, [socket, queryClient]);

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

	return {
		notifications,
		isLoading,
		markAsRead: markAsReadMutation.mutate,
	};
};
