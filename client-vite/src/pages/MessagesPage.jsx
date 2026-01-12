import React from "react";
import { ChatList } from "../features/chat";
import { Outlet, useParams } from "react-router-dom";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const MessagesPage = () => {
	const { chatId } = useParams();

	return (
		<div className="flex h-[calc(100vh-140px)] bg-white dark:bg-slate-950 overflow-hidden">
			{/* Chat List - Hidden on mobile if a chat is selected */}
			<div
				className={`w-full lg:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col ${
					chatId ? "hidden lg:flex" : "flex"
				}`}
			>
				<ChatList />
			</div>

			{/* Chat Detail - Full screen on mobile if a chat is selected, hidden if not */}
			<div
				className={`flex-1 flex flex-col ${
					!chatId ? "hidden lg:flex" : "flex"
				}`}
			>
				{chatId ? (
					<Outlet />
				) : (
					<div className="flex-1 flex flex-col items-center justify-center text-center p-8">
						<div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
							<HiOutlineChatAlt2 size={40} />
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
							Select a message
						</h3>
						<p className="text-slate-500 dark:text-slate-400 max-w-xs">
							Choose from your existing conversations or start a new one to
							begin chatting.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MessagesPage;
