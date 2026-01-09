import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentService from "../services/commentService";

export const useAddComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.addComment,
		onSuccess: (data, { postId }) => {
			queryClient.invalidateQueries(["post", postId]);
			queryClient.invalidateQueries(["posts"]);
		},
	});
};

export const useLikeComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.likeComment,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
		},
	});
};

export const useAddReply = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.addReply,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
			queryClient.invalidateQueries(["posts"]);
		},
	});
};

export const useLikeReply = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.likeReply,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
		},
	});
};
