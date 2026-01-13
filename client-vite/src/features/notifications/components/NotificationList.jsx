import React, { useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useSocket } from "../../../shared/hooks/useSocket";
import { HiOutlineBell } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import NotificationItem from "./detail/NotificationItem";

const NotificationList = ({
	filterType,
	onClose,
	hideHeader = false,
	isDropdown = true,
}) => {
	const {
		notifications,
		isLoading,
		markAsRead,
		markAllAsRead,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useNotifications();
	const { onlineUsers } = useSocket();

	const { ref, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	// Set up infinite scrolling for non-dropdown view
	useEffect(() => {
		if (isDropdown) return;

		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, isDropdown, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Filter notifications based on type if filterType is provided
	const filteredNotifications =
		notifications?.filter((n) => {
			if (filterType === "messages") return n.type === "message";
			if (filterType === "general") return n.type !== "message";
			return true;
		}) || [];

	// Limit notifications to 5 items only in dropdown context
	const displayNotifications = isDropdown
		? filteredNotifications.slice(0, 5)
		: filteredNotifications;
	const hasMore = isDropdown && filteredNotifications.length > 5;

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

	const unreadCount = filteredNotifications?.filter((n) => !n.read).length || 0;

	return (
		<div className="flex flex-col max-h-[550px] w-full overflow-hidden bg-white dark:bg-slate-900">
			{!hideHeader && (
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
						onClick={() => markAllAsRead?.(filterType)}
						className="text-[11px] font-black text-primary hover:text-white dark:text-primary dark:hover:text-white transition-all duration-300 active:scale-95 bg-primary/10 hover:bg-primary px-4 py-2 rounded-full border border-primary/20 hover:border-primary shadow-sm shadow-primary/10"
					>
						Mark all as read
					</button>
				</div>
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
