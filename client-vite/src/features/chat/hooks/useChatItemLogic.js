import { formatDistanceToNow } from "date-fns";

export const useChatItemLogic = (chat, currentUser, onlineUsers) => {
	const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
	const lastMessage = chat.latestMessage;
	const isOnline = onlineUsers?.some(
		(u) => String(u.userId) === String(otherUser?._id)
	);

	const isLastMessageFromMe =
		lastMessage &&
		String(lastMessage.sender || lastMessage.senderId) === String(currentUser?._id);

	const timeAgo = lastMessage?.createdAt && !isNaN(new Date(lastMessage.createdAt).getTime())
		? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false })
		: "now";

	const messagePreview = lastMessage
		? lastMessage.content || (lastMessage.file?.length > 0 ? "Shared images" : "No messages yet")
		: "No messages yet";

	return {
		otherUser,
		lastMessage,
		isOnline,
		isLastMessageFromMe,
		timeAgo,
		messagePreview,
	};
};
