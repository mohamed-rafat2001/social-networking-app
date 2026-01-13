import { useState } from "react";
import { toast } from "react-hot-toast";
import {
	useLikeComment,
	useAddReply,
	useLikeReply,
	useUpdateComment,
	useDeleteComment,
	useUpdateReply,
	useDeleteReply,
} from "./useCommentQueries";

export function useCommentActions(postId) {
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [editingComment, setEditingComment] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [editingReply, setEditingReply] = useState(null);
	const [editReplyContent, setEditReplyContent] = useState("");
	const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
	const [replyToDelete, setReplyToDelete] = useState(null);

	const { mutate: likeComment } = useLikeComment();
	const { mutate: addReply, isLoading: isReplying } = useAddReply();
	const { mutate: likeReply } = useLikeReply();
	const { mutate: updateComment } = useUpdateComment();
	const { mutate: deleteComment } = useDeleteComment();
	const { mutate: updateReply } = useUpdateReply();
	const { mutate: deleteReply } = useDeleteReply();

	const handleUpdateComment = () => {
		if (!editContent.trim()) return;
		updateComment(
			{
				commentId: editingComment._id,
				commentData: { commentBody: editContent },
				postId,
			},
			{
				onSuccess: () => {
					setEditingComment(null);
					toast.success("Comment updated");
				},
			}
		);
	};

	const handleDeleteComment = (commentId) => {
		deleteComment(
			{ commentId, postId },
			{
				onSuccess: () => toast.success("Comment deleted"),
			}
		);
	};

	const handleUpdateReply = () => {
		if (!editReplyContent.trim()) return;
		updateReply(
			{
				replyId: editingReply._id,
				replyData: { replayBody: editReplyContent },
				postId,
			},
			{
				onSuccess: () => {
					setEditingReply(null);
					toast.success("Reply updated");
				},
			}
		);
	};

	const handleDeleteReply = () => {
		if (!replyToDelete) return;
		deleteReply(
			{
				commentId: replyToDelete.commentId,
				replyId: replyToDelete.replyId,
				postId,
			},
			{
				onSuccess: () => {
					setReplyToDelete(null);
					toast.success("Reply deleted");
				},
			}
		);
	};

	const handleAddReply = (commentId, recipientId) => {
		if (!replyText.trim()) return;
		addReply(
			{
				commentId,
				replyData: { replayBody: replyText },
				postId,
				postAuthorId: recipientId,
			},
			{
				onSuccess: () => {
					setReplyText("");
					setShowReplyInput(false);
					toast.success("Reply added!");
				},
			}
		);
	};

	return {
		showReplyInput,
		setShowReplyInput,
		replyText,
		setReplyText,
		editingComment,
		setEditingComment,
		editContent,
		setEditContent,
		editingReply,
		setEditingReply,
		editReplyContent,
		setEditReplyContent,
		isDeleteCommentModalOpen,
		setIsDeleteCommentModalOpen,
		replyToDelete,
		setReplyToDelete,
		likeComment,
		handleAddReply,
		isReplying,
		likeReply,
		handleUpdateComment,
		handleDeleteComment,
		handleUpdateReply,
		handleDeleteReply,
	};
}
