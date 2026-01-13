import { useEffect } from "react";
import { useNotifications } from "./useNotifications";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useInView } from "react-intersection-observer";

export const useNotificationListLogic = (filterType, isDropdown) => {
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
	const unreadCount = filteredNotifications?.filter((n) => !n.read).length || 0;

	return {
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
	};
};
