import React from "react";
import { ConfirmModal } from "../../../shared/components/ui";
import ChatItem from "./detail/ChatItem";
import ChatListHeader from "./ChatListHeader";
import NewChatModal from "./NewChatModal";
import ChatListEmpty from "./ChatListEmpty";
import ChatListSkeleton from "./ChatListSkeleton";
import { useChatListLogic } from "../hooks/useChatListLogic";

const ChatList = () => {
	const {
		activeChatId,
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
	} = useChatListLogic();

	if (isLoading) {
		return <ChatListSkeleton />;
	}

	return (
		<div className="relative h-full flex flex-col bg-white dark:bg-slate-950">
			<ChatListHeader
				onNewChat={() => setShowNewChat(true)}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			<NewChatModal
				isOpen={showNewChat}
				onClose={() => setShowNewChat(false)}
			/>

			<div className="flex-1 overflow-y-auto custom-scrollbar">
				{!filteredChats?.length ? (
					<ChatListEmpty
						searchQuery={searchQuery}
						onStartChat={() => setShowNewChat(true)}
					/>
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
