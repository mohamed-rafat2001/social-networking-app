import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useSocket } from "../../../shared/hooks/useSocket";
import { HiOutlineBell } from "react-icons/hi";
import { Link } from "react-router-dom";
import NotificationItem from "./detail/NotificationItem";

const NotificationList = ({ filterType, onClose, hideHeader = false }) => {
	const { notifications, isLoading, markAsRead, markAllAsRead } =
		useNotifications();
	const { onlineUsers } = useSocket();

	// Filter notifications based on type if filterType is provided
	const filteredNotifications = notifications?.filter((n) => {
		if (filterType === "messages") return n.type === "message";
		if (filterType === "general") return n.type !== "message";
		return true;
	});

	// Limit notifications to 5 items in dropdown
	const limitedNotifications = filteredNotifications?.slice(0, 5);
	const hasMore = filteredNotifications?.length > 5;

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 p-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="flex gap-4 animate-pulse">
						<div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
						<div className="flex-1 space-y-2 py-1">
							<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!filteredNotifications?.length) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center px-4">
				<div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
					<HiOutlineBell size={40} />
				</div>
				<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
					No {filterType === "messages" ? "messages" : "notifications"} yet
				</h3>
				<p className="text-gray-500 dark:text-gray-400 max-w-xs">
					{filterType === "messages"
						? "When you receive new messages, they'll show up here."
						: "When you get likes, comments, or new followers, they'll show up here."}
				</p>
			</div>
		);
	}

	const unreadCount = filteredNotifications.filter((n) => !n.read).length;

	return (
		<div className="flex flex-col h-full">
			{!hideHeader && (
				<div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
					<h2 className="text-lg font-bold text-slate-900 dark:text-white">
						{filterType === "messages" ? "Messages" : "Notifications"}
					</h2>
					{unreadCount > 0 && (
						<button
							onClick={() => markAllAsRead?.()}
							className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							Mark all as read
						</button>
					)}
				</div>
			)}
			<div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
				{limitedNotifications.map((notification) => (
					<NotificationItem
						key={notification._id}
						notification={notification}
						markAsRead={markAsRead}
						onlineUsers={onlineUsers}
						onClose={onClose}
					/>
				))}
			</div>
			{hasMore && (
				<Link
					to={filterType === "messages" ? "/messages" : "/notifications"}
					onClick={onClose}
					className="block w-full p-4 text-center text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800"
				>
					Show All {filterType === "messages" ? "Messages" : "Notifications"}
				</Link>
			)}
		</div>
	);
};

export default NotificationList;
