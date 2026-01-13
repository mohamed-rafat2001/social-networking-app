import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../../shared/components/ui";
import { useNotificationItemLogic } from "../../hooks/useNotificationItemLogic";

const NotificationItem = ({
	notification,
	markAsRead,
	onlineUsers,
	onClose,
}) => {
	const { getIcon, handleClick, handleProfileClick, getNotificationText } =
		useNotificationItemLogic(notification, markAsRead, onClose);

	const isOnline = onlineUsers?.some(
		(u) => String(u.userId) === String(notification.sender._id)
	);

	return (
		<div
			onClick={handleClick}
			className={`flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-pointer relative group border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${
				!notification.read ? "bg-primary/5 dark:bg-primary/5" : ""
			}`}
		>
			<div className="relative shrink-0" onClick={handleProfileClick}>
				<Avatar
					src={notification.sender.image?.secure_url}
					size="lg"
					className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300"
					isActive={isOnline}
				/>
				<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 transform group-hover:scale-110 transition-transform duration-300">
					<div className="text-[12px]">{getIcon(notification.type)}</div>
				</div>
			</div>

			<div className="flex-1 min-w-0 flex flex-col justify-center">
				<div className="flex items-baseline justify-between gap-2">
					<p className="text-[14px] text-slate-900 dark:text-slate-100 leading-tight">
						<span
							className="font-black hover:text-primary transition-colors cursor-pointer"
							onClick={handleProfileClick}
						>
							{notification.sender.firstName} {notification.sender.lastName}
						</span>{" "}
						<span className="text-slate-500 dark:text-slate-400 font-medium">
							{getNotificationText()}
						</span>
					</p>
					{!notification.read && (
						<div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 shadow-sm shadow-primary/40 animate-pulse"></div>
					)}
				</div>

				{notification.content && (
					<div className="mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
						<p className="text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 font-medium italic leading-relaxed">
							{notification.content}
						</p>
					</div>
				)}

				<div className="flex items-center gap-2 mt-2">
					<p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
						{notification.createdAt &&
						!isNaN(new Date(notification.createdAt).getTime())
							? formatDistanceToNow(new Date(notification.createdAt), {
									addSuffix: true,
							  })
							: "just now"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default NotificationItem;
