import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const NotificationManager = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const location = useLocation();

	useEffect(() => {
		if (!socket) return;

		const handleNotification = (notification) => {
			// Update query data
			queryClient.setQueryData(["notifications"], (old) => {
				if (!old) return [notification];
				if (old.some((n) => n._id === notification._id)) return old;
				return [notification, ...old];
			});

			// Show toast
			const senderName = `${notification.sender.firstName} ${notification.sender.lastName}`;
			let message = "";
			switch (notification.type) {
				case "like":
					message = `${senderName} liked your post`;
					break;
				case "comment":
					message = `${senderName} commented on your post`;
					break;
				case "follow":
					message = `${senderName} started following you`;
					break;
				case "mention":
					message = `${senderName} mentioned you in a post`;
					break;
				case "share":
					message = `${senderName} shared your post`;
					break;
				default:
					message = `New notification from ${senderName}`;
			}

			toast.success(message, {
				icon: "🔔",
				duration: 4000,
			});
		};

		const handleMessage = (newMessage) => {
			const isInChat = location.pathname === `/messages/${newMessage.chatId}`;

			if (!isInChat) {
				const senderName = newMessage.senderName || "Someone";
				toast.success(
					`New message from ${senderName}: ${newMessage.content.substring(
						0,
						30
					)}${newMessage.content.length > 30 ? "..." : ""}`,
					{
						icon: "💬",
						duration: 4000,
					}
				);

				queryClient.invalidateQueries(["chats"]);
			}
		};

		socket.on("getNotification", handleNotification);
		socket.on("getMessage", handleMessage);

		return () => {
			socket.off("getNotification", handleNotification);
			socket.off("getMessage", handleMessage);
		};
	}, [socket, queryClient, location.pathname]);

	return null;
};

export default NotificationManager;
