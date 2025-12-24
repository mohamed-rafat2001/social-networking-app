import { useChats } from "../hooks/useChatQueries";
import { Link } from "react-router-dom";
import { Avatar } from "../../../ui";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "../../../hooks/useUser";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const ChatList = () => {
	const { data: chats, isLoading } = useChats();
	const { user: currentUser } = useUser();

	if (isLoading) {
		return (
			<div className="p-4 space-y-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex gap-3 animate-pulse">
						<div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
						<div className="flex-1 space-y-2 py-1">
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
							<div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!chats?.length) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center px-4">
				<div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
					<HiOutlineChatAlt2 size={40} />
				</div>
				<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
					No conversations yet
				</h3>
				<p className="text-gray-500 dark:text-gray-400 max-w-xs">
					Start a conversation with other students to collaborate on projects or
					study together.
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-gray-100 dark:divide-gray-800">
			{chats.map((chat) => {
				const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
				const lastMessage = chat.latestMessage;

				return (
					<Link
						key={chat._id}
						to={`/messages/${chat._id}`}
						className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
					>
						<Avatar src={otherUser?.image?.secure_url} size="lg" />
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-baseline mb-1">
								<h4 className="font-bold text-gray-900 dark:text-white truncate">
									{otherUser?.firstName} {otherUser?.lastName}
								</h4>
								{lastMessage && (
									<span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
										{formatDistanceToNow(new Date(lastMessage.createdAt), {
											addSuffix: true,
										})}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
								{lastMessage ? (
									<>
										{lastMessage.sender === currentUser?._id ? "You: " : ""}
										{lastMessage.content}
									</>
								) : (
									"No messages yet"
								)}
							</p>
						</div>
						{chat.unreadCount > 0 && (
							<div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
								{chat.unreadCount}
							</div>
						)}
					</Link>
				);
			})}
		</div>
	);
};

export default ChatList;
