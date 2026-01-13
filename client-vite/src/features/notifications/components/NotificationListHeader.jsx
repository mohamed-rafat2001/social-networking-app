import React from "react";

const NotificationListHeader = ({ filterType, unreadCount, onMarkAllAsRead }) => {
	return (
		<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
			<div>
				<h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
					{filterType === "messages" ? "Messages" : "Notifications"}
				</h2>
				<div className="flex items-center gap-2">
					<span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
					<p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
						{unreadCount} UNREAD
					</p>
				</div>
			</div>
			<button
				onClick={() => onMarkAllAsRead?.(filterType)}
				className="text-[11px] font-black text-primary hover:text-white dark:text-primary dark:hover:text-white transition-all duration-300 active:scale-95 bg-primary/10 hover:bg-primary px-4 py-2 rounded-full border border-primary/20 hover:border-primary shadow-sm shadow-primary/10"
			>
				Mark all as read
			</button>
		</div>
	);
};

export default NotificationListHeader;
