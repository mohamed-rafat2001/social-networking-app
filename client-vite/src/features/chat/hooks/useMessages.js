import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser } from "../../../shared/hooks/useUser";
import { useNotifications } from "../../notifications/hooks/useNotifications";
import { useMessages as useMessagesQuery } from "./useMessageQueries";

export const useMessages = () => {
	const activeChat = useSelector((state) => state.chats.activeChat);
	const [userDetails, setUserDetails] = useState({});
	const { user: currentUser } = useUser();
	const { notifications } = useNotifications();

	const allMessageNotifications =
		notifications?.filter((n) => n.isRead === false).length || 0;

	const { data: messagesData, isLoading } = useMessagesQuery(activeChat?._id);

	useEffect(() => {
		if (activeChat?.members && currentUser?._id) {
			const member = activeChat.members.find(
				(m) => m.userId?._id !== currentUser._id
			);
			const otherUser =
				member?.userId ||
				activeChat.members.find((m) => m.secondId?._id !== currentUser._id)
					?.secondId;
			setUserDetails(otherUser || {});
		}
	}, [activeChat, currentUser?._id]);

	return {
		chatId: activeChat?._id,
		user: userDetails,
		allMessages: messagesData?.data || [],
		isLoading,
		allMessageNotifications,
	};
};
