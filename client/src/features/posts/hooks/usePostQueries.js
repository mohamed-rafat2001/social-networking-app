import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as postService from "../services/postService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";

export const usePosts = () => {
	return useQuery({
		queryKey: ["posts"],
		queryFn: postService.getPosts,
		refetchInterval: 10000,
	});
};

export const useAddPost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.addPost,
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["userProfile"]);
			queryClient.invalidateQueries(["currentUser"]);
		},
	});
};

export const useSinglePost = (postId) => {
	return useQuery({
		queryKey: ["post", postId],
		queryFn: () => postService.getSinglePost(postId),
		enabled: !!postId,
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: postService.likePost,
		onSuccess: (response, postId) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);

			// Emit socket event for notification
			const post = response.data;
			if (socket && post && post.userId?._id !== currentUser?._id) {
				socket.emit("sendNotification", {
					recipientId: post.userId?._id || post.userId,
					notification: {
						type: "like",
						sender: currentUser,
						post: post,
						createdAt: new Date(),
						read: false,
					},
				});
			}
		},
	});
};

export const useSharePost = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: postService.sharePost,
		onSuccess: (response, postId) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);

			// We need to fetch the original post to get the recipientId
			// For simplicity, we'll assume the API response includes enough info or we can handle it via the server emitting the event
			// But since we're doing it client-side for now:
			const sharedPost = response.data;
			if (socket && sharedPost && sharedPost.userId !== currentUser?._id) {
				// Note: In a real app, the server should probably emit this to be more reliable
				// But we'll try to get the recipient from the query cache or wait for server integration
			}
		},
	});
};

export const useIncrementView = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.incrementView,
		onSuccess: (data, postId) => {
			// Update the cache directly to avoid a refetch for just a view count
			queryClient.setQueryData(["posts"], (old) => {
				if (!old) return old;
				return {
					...old,
					data: old.data.map((post) =>
						post._id === postId
							? { ...post, views: (post.views || 0) + 1 }
							: post
					),
				};
			});
			queryClient.setQueryData(["post", postId], (old) => {
				if (!old) return old;
				return {
					...old,
					data: { ...old.data, views: (old.data.views || 0) + 1 },
				};
			});
		},
	});
};
