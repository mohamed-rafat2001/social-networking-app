import React from "react";
import { AnimatePresence } from "framer-motion";
import EmptyChat from "./EmptyChat";
import MessageItem from "./MessageItem";

const ChatMessageList = ({
	messages,
	currentUser,
	otherUser,
	setEditingMessage,
	setEditContent,
	setMessageToDelete,
	messagesEndRef,
}) => {
	return (
		<div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
			<AnimatePresence initial={false}>
				{messages.length === 0 ? (
					<EmptyChat otherUser={otherUser} />
				) : (
					messages.map((msg) => {
						const isMe =
							String(msg.senderId) === String(currentUser?._id) ||
							String(msg.sender) === String(currentUser?._id);

						return (
							<MessageItem
								key={msg._id}
								msg={msg}
								currentUser={currentUser}
								isMe={isMe}
								setEditingMessage={setEditingMessage}
								setEditContent={setEditContent}
								setMessageToDelete={setMessageToDelete}
							/>
						);
					})
				)}
			</AnimatePresence>
			<div ref={messagesEndRef} className="h-4" />
		</div>
	);
};

export default ChatMessageList;
