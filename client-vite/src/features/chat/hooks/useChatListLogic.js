import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useChats, useDeleteChat } from "./useChatQueries";
import { useUser } from "../../../shared/hooks/useUser";
import { useSocket } from "../../../shared/hooks/useSocket";

export const useChatListLogic = () => {
	const { chatId: activeChatId } = useParams();
	const { data: chats, isLoading } = useChats();
	const { user: currentUser } = useUser();
	const { onlineUsers } = useSocket();
	const { mutate: deleteChat } = useDeleteChat();
	const [showNewChat, setShowNewChat] = useState(false);
	const [chatToDelete, setChatToDelete] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredChats = useMemo(() => {
		if (!chats) return [];
		if (!searchQuery.trim()) return chats;

		const query = searchQuery.toLowerCase();
		return chats.filter((chat) => {
			const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
			if (!otherUser) return false;
			const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
			return (
				fullName.includes(query) ||
				otherUser.username?.toLowerCase().includes(query)
			);
		});
	}, [chats, searchQuery, currentUser?._id]);

	const handleDeleteChat = () => {
		if (chatToDelete) {
			deleteChat(chatToDelete);
			setChatToDelete(null);
		}
	};

	return {
		activeChatId,
		chats,
		isLoading,
		currentUser,
		onlineUsers,
		showNewChat,
		setShowNewChat,
		chatToDelete,
		setChatToDelete,
		searchQuery,
		setSearchQuery,
		filteredChats,
		handleDeleteChat,
	};
};
