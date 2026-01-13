import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	getNotifications,
	markAsRead,
	markAllAsRead,
} from "../services/notificationService";
import { useUser } from "../../../shared/hooks/useUser";
import { toast } from "react-hot-toast";

export const useNotifications = () => {
	const queryClient = useQueryClient();
	const { user } = useUser();

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["notifications"],
			queryFn: ({ pageParam = 1 }) => getNotifications(pageParam),
			getNextPageParam: (lastPage, allPages) => {
				const totalFetched = allPages.flatMap((page) => page.data).length;
				if (totalFetched < lastPage.totalResults) {
					return allPages.length + 1;
				}
				return undefined;
			},
			enabled: !!user,
		});

	// Flatten all notifications from all pages
	const notifications = data?.pages.flatMap((page) => page.data) || [];
	const totalResults = data?.pages[0]?.totalResults || 0;

	const markAsReadMutation = useMutation({
		mutationFn: markAsRead,
		onSuccess: (updatedNotification) => {
			queryClient.setQueryData(["notifications"], (old) => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						data: page.data.map((n) =>
							n._id === updatedNotification._id ? { ...n, read: true } : n
						),
					})),
				};
			});
		},
		onError: (error) => {
			toast.error("Failed to mark notification as read");
		},
	});

	const markAllAsReadMutation = useMutation({
		mutationFn: (type) => markAllAsRead(type),
		onSuccess: (_, type) => {
			queryClient.setQueryData(["notifications"], (old) => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						data: page.data.map((n) => {
							if (!type) return { ...n, read: true };
							if (type === "messages" && n.type === "message")
								return { ...n, read: true };
							if (type === "general" && n.type !== "message")
								return { ...n, read: true };
							return n;
						}),
					})),
				};
			});
		},
	});

	return {
		notifications,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		markAsRead: markAsReadMutation.mutate,
		markAllAsRead: markAllAsReadMutation.mutate,
		totalResults,
	};
};
