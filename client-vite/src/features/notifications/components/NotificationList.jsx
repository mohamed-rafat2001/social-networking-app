import React from "react";
import { Link } from "react-router-dom";
import NotificationItem from "./detail/NotificationItem";
import NotificationListHeader from "./NotificationListHeader";
import NotificationListEmpty from "./NotificationListEmpty";
import NotificationListSkeleton from "./NotificationListSkeleton";
import { useNotificationListLogic } from "../hooks/useNotificationListLogic";

const NotificationList = ({
	filterType,
	onClose,
	hideHeader = false,
	isDropdown = true,
}) => {
	const {
		displayNotifications,
		isLoading,
		markAsRead,
		markAllAsRead,
		onlineUsers,
		hasNextPage,
		isFetchingNextPage,
		hasMore,
		unreadCount,
		ref,
		filteredNotifications,
	} = useNotificationListLogic(filterType, isDropdown);

	if (isLoading) {
		return <NotificationListSkeleton />;
	}

	if (!filteredNotifications?.length) {
		return <NotificationListEmpty filterType={filterType} />;
	}

	return (
		<div className="flex flex-col max-h-[550px] w-full overflow-hidden bg-white dark:bg-slate-900">
			{!hideHeader && (
				<NotificationListHeader
					filterType={filterType}
					unreadCount={unreadCount}
					onMarkAllAsRead={markAllAsRead}
				/>
			)}
			<div className="flex-1 overflow-y-auto custom-scrollbar">
				{displayNotifications.map((notification) => (
					<NotificationItem
						key={notification._id}
						notification={notification}
						markAsRead={markAsRead}
						onlineUsers={onlineUsers}
						onClose={onClose}
					/>
				))}

				{/* Infinite Scroll Trigger */}
				{!isDropdown && (
					<div ref={ref} className="py-8 flex justify-center items-center">
						{isFetchingNextPage ? (
							<div className="flex flex-col items-center gap-2">
								<div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
								<span className="text-xs font-medium text-slate-400">
									Loading more notifications...
								</span>
							</div>
						) : hasNextPage ? (
							<div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
						) : (
							<div className="py-4 text-center">
								<p className="text-sm font-medium text-slate-400">
									No more notifications
								</p>
							</div>
						)}
					</div>
				)}
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
