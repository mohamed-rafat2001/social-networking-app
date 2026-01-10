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

			const post = response.data;
			// If it's a new like (not an unlike) and not our own post
			if (
				socket &&
				post &&
				post.userId !== currentUser?._id &&
				post.likes.includes(currentUser?._id)
			) {
				socket.emit("sendNotification", {
					recipientId: post.userId,
					notification: {
						type: "like",
						sender: currentUser,
						post: { _id: postId },
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
		onSuccess: (response, { postId }) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);

			const shareData = response.data;
			if (socket && shareData && shareData.userId !== currentUser?._id) {
				// We need the original post author ID.
				// Since we don't have it easily here, we'll assume the server
				// already created the notification and we just need to notify the UI if possible.
				// However, for the toast to show up for the OTHER user, we MUST have their recipientId.
				// For now, let's just trigger the invalidation.
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
					data: old.data.map((p) =>
						p._id === postId ? { ...p, views: (p.views || 0) + 1 } : p
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

export const useUpdatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.updatePost,
		onSuccess: (response, { postId }) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);
		},
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.deletePost,
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["userProfile"]);
		},
	});
};
