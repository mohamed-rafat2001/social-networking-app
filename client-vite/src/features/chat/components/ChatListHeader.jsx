import React from "react";
import { motion } from "framer-motion";
import { HiPlus, HiSearch } from "react-icons/hi";

const ChatListHeader = ({ onNewChat, searchQuery, onSearchChange }) => {
	return (
		<div className="p-4 space-y-4 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800/50">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
					Messages
				</h2>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onNewChat}
					className="p-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
				>
					<HiPlus size={20} />
				</motion.button>
			</div>

			<div className="relative group">
				<HiSearch
					className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
					size={18}
				/>
				<input
					type="text"
					placeholder="Search conversations..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 dark:placeholder:text-slate-600 transition-all dark:text-white"
				/>
			</div>
		</div>
	);
};

export default ChatListHeader;
