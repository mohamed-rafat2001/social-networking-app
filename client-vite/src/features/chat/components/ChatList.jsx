import React, { useState, useMemo } from "react";
import { useChats, useDeleteChat } from "../hooks/useChatQueries";
import { useParams } from "react-router-dom";
import { ConfirmModal } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useSocket } from "../../../shared/hooks/useSocket";
import { HiOutlineChatAlt2, HiPlus, HiSearch } from "react-icons/hi";
import UserSearch from "./UserSearch";
import { AnimatePresence, motion } from "framer-motion";
import ChatItem from "./detail/ChatItem";

const ChatList = () => {
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

	if (isLoading) {
		return (
			<div className="p-4 space-y-4">
				<div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
				{[1, 2, 3, 4, 5, 6].map((i) => (
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
		<div className="relative h-full flex flex-col bg-white dark:bg-slate-950">
			<div className="p-4 space-y-4 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800/50">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
						Messages
					</h2>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowNewChat(true)}
						className="p-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
					>
						<HiPlus size={20} />
					</motion.button>
				</div>

				<div className="relative group">
					<HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
					<input
						type="text"
						placeholder="Search conversations..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all"
					/>
				</div>
			</div>

			<AnimatePresence>
				{showNewChat && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0"
							onClick={() => setShowNewChat(false)}
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="relative w-full max-w-md shadow-2xl"
						>
							<UserSearch onClose={() => setShowNewChat(false)} />
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<div className="flex-1 overflow-y-auto custom-scrollbar">
				{!filteredChats?.length ? (
					<div className="flex flex-col items-center justify-center py-20 text-center px-4">
						<div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
							<HiOutlineChatAlt2 size={40} />
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
							{searchQuery ? "No results found" : "No conversations yet"}
						</h3>
						<p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6 text-sm">
							{searchQuery
								? `We couldn't find any conversations matching "${searchQuery}"`
								: "Start a conversation with other students to collaborate in groups or study together."}
						</p>
						{!searchQuery && (
							<button
								onClick={() => setShowNewChat(true)}
								className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
							>
								Start a Chat
							</button>
						)}
					</div>
				) : (
					<div className="py-2">
						{filteredChats.map((chat) => (
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
