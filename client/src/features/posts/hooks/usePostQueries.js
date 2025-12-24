import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as postService from "../../../services/postService";

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
		},
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.likePost,
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
		},
	});
};

export const useSharePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postService.sharePost,
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
		},
	});
};
