import React from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const ChatListEmpty = ({ searchQuery, onStartChat }) => {
	return (
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
					onClick={onStartChat}
					className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
				>
					Start a Chat
				</button>
			)}
		</div>
	);
};

export default ChatListEmpty;
