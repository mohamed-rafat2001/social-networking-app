import React from "react";
import { ChatList } from "../features/chat";
import { Outlet, useParams } from "react-router-dom";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { motion } from "framer-motion";

const MessagesPage = () => {
	const { chatId } = useParams();

	return (
		<div className="flex h-[calc(100vh-64px)] bg-white dark:bg-slate-950 overflow-hidden">
			{/* Chat List - Hidden on mobile if a chat is selected */}
			<div
				className={`w-full lg:w-[400px] border-r border-slate-100 dark:border-slate-800 flex flex-col ${
					chatId ? "hidden lg:flex" : "flex"
				}`}
			>
				<ChatList />
			</div>

			{/* Chat Detail - Full screen on mobile if a chat is selected, hidden if not */}
			<div
				className={`flex-1 flex flex-col relative ${
					!chatId ? "hidden lg:flex" : "flex"
				}`}
			>
				{chatId ? (
					<Outlet />
				) : (
					<motion.div 
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-950/50"
					>
						<div className="relative mb-8">
							<div className="w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary/40 rotate-12 animate-pulse">
								<HiOutlineChatAlt2 size={48} />
							</div>
							<div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-primary">
								<HiOutlineChatAlt2 size={20} />
							</div>
						</div>
						<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
							Select a conversation
						</h3>
						<p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
							Choose from your existing conversations or start a new one to
							begin chatting with other engineers.
						</p>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default MessagesPage;
