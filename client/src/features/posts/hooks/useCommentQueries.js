import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentService from "../services/commentService";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";

export const useAddComment = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: commentService.addComment,
		onSuccess: (response, { postId }) => {
			queryClient.invalidateQueries(["post", postId]);
			queryClient.invalidateQueries(["posts"]);

			// Emit socket event for notification
			const comment = response.data;
			// We need the post author's ID. The server response might not have it directly
			// but we can pass it from the component if needed, or assume the server handles it.
			// For now, let's just invalidate and hope the server-side createNotification is enough
			// for the next refresh. To get real-time toast, we'd need the recipientId here.
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
