import React from "react";
import { motion } from "framer-motion";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const EmptyChat = ({ otherUser }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="h-full flex flex-col items-center justify-center text-center p-8"
		>
			<div className="w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary rotate-12">
				<HiOutlineChatAlt2 size={40} />
			</div>
			<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
				Start a conversation
			</h3>
			<p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
				Send a message to start the conversation with{" "}
				<span className="font-semibold text-primary">
					{otherUser?.firstName} {otherUser?.lastName}
				</span>
			</p>
		</motion.div>
	);
};

export default EmptyChat;
