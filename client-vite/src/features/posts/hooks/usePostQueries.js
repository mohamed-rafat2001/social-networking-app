import {
	useMutation,
	useQueryClient,
	useQuery,
	useInfiniteQuery,
} from "@tanstack/react-query";
import * as postService from "../services/postService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";

export const usePosts = (feedType = "for-you") => {
	return useInfiniteQuery({
		queryKey: ["posts", feedType],
		queryFn: ({ pageParam = 1 }) => postService.getPosts(feedType, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			const totalFetched = allPages.flatMap((page) => page.data).length;
			if (totalFetched < lastPage.totalResults) {
				return allPages.length + 1;
			}
			return undefined;
		},
		refetchInterval: 10000,
		enabled: true,
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
		onMutate: async (postId) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["posts"] });
			await queryClient.cancelQueries({ queryKey: ["post", postId] });
			await queryClient.cancelQueries({ queryKey: ["userProfile"] });

			// Snapshot the previous value
			const previousPosts = queryClient.getQueryData(["posts"]);
			const previousPost = queryClient.getQueryData(["post", postId]);
			const previousProfiles = queryClient.getQueriesData({
				queryKey: ["userProfile"],
			});

			// Optimistically update to the new value
			const updatePostInList = (old) => {
				if (!old || !old.data) return old;
				return {
					...old,
					data: Array.isArray(old.data)
						? old.data.map((p) => {
								if (p._id === postId) {
									const isLiked = p.likes?.some(
										(like) => (like._id || like) === currentUser?._id
									);
									const newLikes = isLiked
										? p.likes.filter(
												(like) => (like._id || like) !== currentUser?._id
										  )
										: [...(p.likes || []), currentUser?._id];

									return {
										...p,
										likes: newLikes,
										likesNumber: isLiked
											? Math.max(0, (p.likesNumber || 1) - 1)
											: (p.likesNumber || 0) + 1,
									};
								}
								return p;
						  })
						: old.data,
				};
			};

			queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostInList);

			// Also update userProfile queries if they exist (they contain posts)
			queryClient.setQueriesData({ queryKey: ["userProfile"] }, (old) => {
				if (!old || !old.data || !old.data.posts) return old;
				return {
					...old,
					data: {
						...old.data,
						posts: old.data.posts.map((p) => {
							if (p._id === postId) {
								const isLiked = p.likes?.some(
									(like) => (like._id || like) === currentUser?._id
								);
								const newLikes = isLiked
									? p.likes.filter(
											(like) => (like._id || like) !== currentUser?._id
									  )
									: [...(p.likes || []), currentUser?._id];

								return {
									...p,
									likes: newLikes,
									likesNumber: isLiked
										? Math.max(0, (p.likesNumber || 1) - 1)
										: (p.likesNumber || 0) + 1,
								};
							}
							return p;
						}),
					},
				};
			});

			queryClient.setQueryData(["post", postId], (old) => {
				if (!old || !old.data) return old;
				const p = old.data;
				const isLiked = p.likes?.some(
					(like) => (like._id || like) === currentUser?._id
				);
				const newLikes = isLiked
					? p.likes.filter((like) => (like._id || like) !== currentUser?._id)
					: [...(p.likes || []), currentUser?._id];

				return {
					...old,
					data: {
						...p,
						likes: newLikes,
						likesNumber: isLiked
							? Math.max(0, (p.likesNumber || 1) - 1)
							: (p.likesNumber || 0) + 1,
					},
				};
			});

			return { previousPosts, previousPost, previousProfiles };
		},
		onError: (err, postId, context) => {
			if (context?.previousPosts) {
				queryClient.setQueriesData(
					{ queryKey: ["posts"] },
					context.previousPosts
				);
			}
			if (context?.previousPost) {
				queryClient.setQueryData(["post", postId], context.previousPost);
			}
			if (context?.previousProfiles) {
				context.previousProfiles.forEach(([queryKey, previousData]) => {
					queryClient.setQueryData(queryKey, previousData);
				});
			}
			toast.error("Failed to update like");
		},
		onSuccess: (response, postId) => {
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
		onSettled: (data, error, postId) => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
			const updateViewCount = (old) => {
				if (!old || !old.data) return old;
				return {
					...old,
					data: Array.isArray(old.data)
						? old.data.map((p) =>
								p._id === postId ? { ...p, views: (p.views || 0) + 1 } : p
						  )
						: old.data,
				};
			};

			queryClient.setQueriesData({ queryKey: ["posts"] }, updateViewCount);

			queryClient.setQueriesData({ queryKey: ["userProfile"] }, (old) => {
				if (!old || !old.data || !old.data.posts) return old;
				return {
					...old,
					data: {
						...old.data,
						posts: old.data.posts.map((p) =>
							p._id === postId ? { ...p, views: (p.views || 0) + 1 } : p
						),
					},
				};
			});

			queryClient.setQueryData(["post", postId], (old) => {
				if (!old || !old.data) return old;
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
