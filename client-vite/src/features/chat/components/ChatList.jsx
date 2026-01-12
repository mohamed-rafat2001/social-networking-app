import React, { useState } from "react";
import { useChats, useDeleteChat } from "../hooks/useChatQueries";
import { useParams } from "react-router-dom";
import { ConfirmModal } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useSocket } from "../../../shared/hooks/useSocket";
import { HiOutlineChatAlt2, HiPlus } from "react-icons/hi";
import UserSearch from "./UserSearch";
import { AnimatePresence } from "framer-motion";
import ChatItem from "./detail/ChatItem";

const ChatList = () => {
	const { chatId: activeChatId } = useParams();
	const { data: chats, isLoading } = useChats();
	const { user: currentUser } = useUser();
	const { onlineUsers } = useSocket();
	const { mutate: deleteChat } = useDeleteChat();
	const [showNewChat, setShowNewChat] = useState(false);
	const [chatToDelete, setChatToDelete] = useState(null);

	const handleDeleteChat = () => {
		if (chatToDelete) {
			deleteChat(chatToDelete);
			setChatToDelete(null);
		}
	};

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

	return (
		<div className="relative h-full flex flex-col">
			<div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
				<h2 className="text-xl font-bold text-gray-900 dark:text-white">
					Messages
				</h2>
				<button
					onClick={() => setShowNewChat(true)}
					className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
				>
					<HiPlus size={20} />
				</button>
			</div>

			<AnimatePresence>
				{showNewChat && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<div
							className="absolute inset-0"
							onClick={() => setShowNewChat(false)}
						/>
						<div className="relative w-full max-w-md">
							<UserSearch onClose={() => setShowNewChat(false)} />
						</div>
					</div>
				)}
			</AnimatePresence>

			<div className="flex-1 overflow-y-auto">
				{!chats?.length ? (
					<div className="flex flex-col items-center justify-center py-20 text-center px-4">
						<div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
							<HiOutlineChatAlt2 size={40} />
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
							No conversations yet
						</h3>
						<p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
							Start a conversation with other students to collaborate in
							groups or study together.
						</p>
						<button
							onClick={() => setShowNewChat(true)}
							className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
						>
							Start a Chat
						</button>
					</div>
				) : (
					<div className="divide-y divide-gray-100 dark:divide-gray-800">
						{chats.map((chat) => (
							<ChatItem
								key={chat._id}
								chat={chat}
								currentUser={currentUser}
								activeChatId={activeChatId}
								onlineUsers={onlineUsers}
								setChatToDelete={setChatToDelete}
							/>
						))}
					</div>
				)}
			</div>

			<ConfirmModal
				isOpen={!!chatToDelete}
				onClose={() => setChatToDelete(null)}
				onConfirm={handleDeleteChat}
				title="Delete Chat"
				message="Are you sure you want to delete this chat? This action cannot be undone."
			/>
		</div>
	);
};

export default ChatList;
