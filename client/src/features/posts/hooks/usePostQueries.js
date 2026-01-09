import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as postService from "../services/postService";

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
	return useMutation({
		mutationFn: postService.likePost,
		onSuccess: (data, postId) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);
		},
	});
};

export const useSharePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.sharePost,
		onSuccess: (data, postId) => {
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["post", postId]);
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
						post._id === postId ? { ...post, views: (post.views || 0) + 1 } : post
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
