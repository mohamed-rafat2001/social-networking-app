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
		onSuccess: (response, { postId, postAuthorId }) => {
			queryClient.invalidateQueries(["post", postId]);
			queryClient.invalidateQueries(["posts"]);

			// Emit socket event for notification
			const comment = response.data;

			if (
				socket &&
				postAuthorId &&
				String(postAuthorId) !== String(currentUser?._id)
			) {
				socket.emit("sendNotification", {
					recipientId: postAuthorId,
					notification: {
						_id: Date.now().toString(),
						type: "comment",
						sender: currentUser,
						post: { _id: postId },
						content: comment.commentBody,
						createdAt: new Date(),
						read: false,
					},
				});
			}
		},
	});
};

export const useLikeComment = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: commentService.likeComment,
		onSuccess: (response, { postId, commentAuthorId, commentId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}

			// Emit socket event for notification
			const comment = response.data;
			if (
				socket &&
				commentAuthorId &&
				String(commentAuthorId) !== String(currentUser?._id) &&
				comment.like.some((id) => String(id) === String(currentUser?._id))
			) {
				socket.emit("sendNotification", {
					recipientId: commentAuthorId,
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

export const useAddReply = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: commentService.addReply,
		onSuccess: (response, { postId, commentAuthorId, commentId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
			queryClient.invalidateQueries(["posts"]);

			// Emit socket event for notification
			const reply = response.data;
			if (
				socket &&
				commentAuthorId &&
				String(commentAuthorId) !== String(currentUser?._id)
			) {
				socket.emit("sendNotification", {
					recipientId: commentAuthorId,
					notification: {
						_id: Date.now().toString(),
						type: "comment",
						sender: currentUser,
						post: { _id: postId },
						content: reply.replayBody,
						createdAt: new Date(),
						read: false,
					},
				});
			}
		},
	});
};

export const useLikeReply = () => {
	const queryClient = useQueryClient();
	const { socket } = useSocket();
	const { user: currentUser } = useUser();

	return useMutation({
		mutationFn: commentService.likeReply,
		onSuccess: (response, { postId, replyAuthorId, replyId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}

			// Emit socket event for notification
			const reply = response.data;
			if (
				socket &&
				replyAuthorId &&
				String(replyAuthorId) !== String(currentUser?._id) &&
				reply.like.some((id) => String(id) === String(currentUser?._id))
			) {
				socket.emit("sendNotification", {
					recipientId: replyAuthorId,
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

export const useUpdateComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.updateComment,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
			queryClient.invalidateQueries(["posts"]);
		},
	});
};

export const useDeleteComment = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.deleteComment,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
			queryClient.invalidateQueries(["posts"]);
		},
	});
};

export const useUpdateReply = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.updateReply,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
		},
	});
};

export const useDeleteReply = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: commentService.deleteReply,
		onSuccess: (data, { postId }) => {
			if (postId) {
				queryClient.invalidateQueries(["post", postId]);
			}
		},
	});
};
