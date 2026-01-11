import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as postService from "../services/postService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";
import { getToken } from "../../../shared/utils/helpers";

export const usePosts = (feedType = "for-you") => {
	const token = getToken();
	return useQuery({
		queryKey: ["posts", feedType],
		queryFn: () => postService.getPosts(feedType),
		refetchInterval: 10000,
		enabled: !!token,
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
			const postAuthorId = post.userId?._id || post.userId;

			// If it's a new like (not an unlike) and not our own post
			if (
				socket &&
				post &&
				String(postAuthorId) !== String(currentUser?._id) &&
				post.likes.some((id) => String(id) === String(currentUser?._id))
			) {
				socket.emit("sendNotification", {
					recipientId: postAuthorId,
					notification: {
						_id: Date.now().toString(),
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
		onSuccess: (response, { postId, recipientId }) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);

			if (
				socket &&
				recipientId &&
				String(recipientId) !== String(currentUser?._id)
			) {
				socket.emit("sendNotification", {
					recipientId: recipientId,
					notification: {
						_id: Date.now().toString(),
						type: "share",
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
