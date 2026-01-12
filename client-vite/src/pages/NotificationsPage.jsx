import React from "react";
import { NotificationList } from "../features/notifications";
import { HiOutlineBell, HiOutlineCheckCircle } from "react-icons/hi";
import { useNotifications } from "../features/notifications/hooks/useNotifications";

const NotificationsPage = () => {
	const { notifications, markAsRead } = useNotifications();

	const unreadCount =
		notifications?.filter((n) => !n.read && n.type !== "message").length || 0;

	const handleMarkAllAsRead = () => {
		notifications?.forEach((n) => {
			if (!n.read && n.type !== "message") markAsRead(n._id);
		});
	};

	return (
		<div className="max-w-2xl mx-auto py-8 px-4">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
						<HiOutlineBell size={28} />
					</div>
					<div>
						<h1 className="text-2xl font-black text-slate-900 dark:text-white">
							Notifications
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							{unreadCount > 0
								? `You have ${unreadCount} unread notifications`
								: "You're all caught up!"}
						</p>
					</div>
				</div>

				{unreadCount > 0 && (
					<button
						onClick={handleMarkAllAsRead}
						className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
					>
						<HiOutlineCheckCircle size={20} />
						Mark all as read
					</button>
				)}
			</div>

			<div className="bg-white dark:bg-slate-950 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
				<NotificationList filterType="general" />
			</div>
		</div>
	);
};

export default NotificationsPage;
