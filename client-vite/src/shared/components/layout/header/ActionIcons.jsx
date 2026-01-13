import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiBell, HiChatAlt, HiSun, HiMoon } from "react-icons/hi";
import { cn } from "../../ui";
import NotificationList from "../../../../features/notifications/components/NotificationList";

const ActionIcons = ({
	showNotifications,
	setShowNotifications,
	showMessages,
	setShowMessages,
	unreadNotificationsCount,
	unreadMessagesCount,
	darkMode,
	toggleDarkMode,
	notificationsRef,
	messagesRef,
}) => {
	return (
		<>
			<div className="relative" ref={notificationsRef}>
				<button
					onClick={() => {
						setShowNotifications(!showNotifications);
						setShowMessages(false);
					}}
					className={cn(
						"p-2.5 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative",
						showNotifications && "text-primary bg-primary/5"
					)}
				>
					<HiBell size={24} />
					{unreadNotificationsCount > 0 && (
						<span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
							{unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
						</span>
					)}
				</button>
				<AnimatePresence>
					{showNotifications && (
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							className="absolute top-full right-0 mt-2 w-[320px] sm:w-[400px] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
						>
							<NotificationList
								filterType="general"
								onClose={() => setShowNotifications(false)}
								isDropdown={true}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="relative" ref={messagesRef}>
				<button
					onClick={() => {
						setShowMessages(!showMessages);
						setShowNotifications(false);
					}}
					className={cn(
						"p-2.5 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative",
						showMessages && "text-primary bg-primary/5"
					)}
				>
					<HiChatAlt size={24} />
					{unreadMessagesCount > 0 && (
						<span className="absolute top-2 right-2 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
							{unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
						</span>
					)}
				</button>
				<AnimatePresence>
					{showMessages && (
						<motion.div
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							className="absolute top-full right-0 mt-2 w-[320px] sm:w-[400px] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
						>
							<NotificationList
								filterType="messages"
								onClose={() => setShowMessages(false)}
								isDropdown={true}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<button
				onClick={toggleDarkMode}
				className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
			>
				{darkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
			</button>
		</>
	);
};

export default ActionIcons;
