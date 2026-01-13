import React from "react";
import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi";
import { cn } from "../../../../shared/components/ui";

const ChatItemStatus = ({ chat, lastMessage, isLastMessageFromMe, messagePreview }) => {
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-1.5 flex-1 min-w-0">
				{isLastMessageFromMe && (
					<div className="shrink-0">
						{lastMessage.read ? (
							<div className="flex -space-x-1">
								<HiCheck className="text-primary" size={12} />
								<HiCheck className="text-primary" size={12} />
							</div>
						) : (
							<HiCheck className="text-slate-300 dark:text-slate-600" size={12} />
						)}
					</div>
				)}
				<p
					className={cn(
						"text-[13px] truncate",
						chat.unreadCount > 0
							? "text-slate-900 dark:text-white font-bold"
							: "text-slate-500 dark:text-slate-400 font-medium"
					)}
				>
					{messagePreview}
				</p>
			</div>

			{chat.unreadCount > 0 && (
				<motion.div
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-primary/30"
				>
					{chat.unreadCount}
				</motion.div>
			)}
		</div>
	);
};

export default ChatItemStatus;
