import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../../shared/components/ui";
import { MessageContent } from "./MessageContent";
import { MessageActions, MessageStatus } from "./MessageActions";

const MessageItem = ({
	msg,
	currentUser,
	isMe,
	setEditingMessage,
	setEditContent,
	setMessageToDelete,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			layout
			className={cn("flex w-full mb-1", isMe ? "justify-end" : "justify-start")}
		>
			<div
				className={cn(
					"flex items-end gap-2 max-w-[85%] sm:max-w-[70%]",
					isMe ? "flex-row-reverse" : "flex-row"
				)}
			>
				<div
					className={cn(
						"flex flex-col gap-1",
						isMe ? "items-end" : "items-start"
					)}
				>
					<div
						className={cn(
							"group relative flex items-center gap-2",
							isMe ? "flex-row-reverse" : "flex-row"
						)}
					>
						<MessageContent msg={msg} isMe={isMe} />

						<MessageActions
							msg={msg}
							isMe={isMe}
							setEditingMessage={setEditingMessage}
							setEditContent={setEditContent}
							setMessageToDelete={setMessageToDelete}
						/>
					</div>

					<MessageStatus msg={msg} isMe={isMe} />
				</div>
			</div>
		</motion.div>
	);
};

export default MessageItem;
