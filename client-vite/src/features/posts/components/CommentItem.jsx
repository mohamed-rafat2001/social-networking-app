import React from "react";
import { AnimatePresence } from "framer-motion";
import { Avatar } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import { useCommentActions } from "../hooks/useCommentActions";
import CommentReply from "./CommentReply";
import CommentReplyInput from "./CommentReplyInput";
import CommentModals from "./CommentModals";
import CommentHeader from "./CommentHeader";
import CommentActions from "./CommentActions";

function CommentItem({ comment, postId }) {
	const { user } = useUser();
	const { darkMode } = useTheme();

	const {
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
	} = useCommentActions(postId);

	const isCommentOwner = user?._id === comment.userId?._id;
	const hasLikedComment = comment.likes?.some(
		(id) => String(id) === String(user?._id)
	);

	return (
		<div className="group relative">
			<div className="flex gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
				<Avatar src={comment.userId?.image?.secure_url} size="md" />
				<div className="flex-1 min-w-0">
					<CommentHeader
						comment={comment}
						isCommentOwner={isCommentOwner}
						onEdit={() => {
							setEditingComment(comment);
							setEditContent(comment.commentBody);
						}}
						onDelete={() => setIsDeleteCommentModalOpen(true)}
					/>

					<p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
						{comment.commentBody}
					</p>

					<CommentActions
						likesCount={comment.likes?.length}
						repliesCount={comment.replies?.length}
						hasLiked={hasLikedComment}
						onLike={() => likeComment({ commentId: comment._id, postId })}
						onToggleReply={() => setShowReplyInput(!showReplyInput)}
					/>

					{/* Reply Input */}
					<AnimatePresence>
						{showReplyInput && (
							<CommentReplyInput
								user={user}
								replyText={replyText}
								setReplyText={setReplyText}
								darkMode={darkMode}
								isReplying={isReplying}
								onCancel={() => setShowReplyInput(false)}
								onSubmit={() =>
									handleAddReply(comment._id, comment.userId?._id)
								}
							/>
						)}
					</AnimatePresence>

					{/* Replies List */}
					{comment.replies?.length > 0 && (
						<div className="mt-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
							{comment.replies.map((reply) => (
								<CommentReply
									key={reply._id}
									reply={reply}
									commentId={comment._id}
									user={user}
									darkMode={darkMode}
									onLike={(cId, rId) =>
										likeReply({ commentId: cId, replyId: rId, postId })
									}
									onEdit={(r) => {
										setEditingReply(r);
										setEditReplyContent(r.replayBody);
									}}
									onDelete={(cId, rId) =>
										setReplyToDelete({ commentId: cId, replyId: rId })
									}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<CommentModals
				isDeleteCommentModalOpen={isDeleteCommentModalOpen}
				setIsDeleteCommentModalOpen={setIsDeleteCommentModalOpen}
				handleDeleteComment={() => handleDeleteComment(comment._id)}
				replyToDelete={replyToDelete}
				setReplyToDelete={setReplyToDelete}
				handleDeleteReply={handleDeleteReply}
				editingComment={editingComment}
				setEditingComment={setEditingComment}
				editContent={editContent}
				setEditContent={setEditContent}
				handleUpdateComment={handleUpdateComment}
				editingReply={editingReply}
				setEditingReply={setEditingReply}
				editReplyContent={editReplyContent}
				setEditReplyContent={setEditReplyContent}
				handleUpdateReply={handleUpdateReply}
			/>
		</div>
	);
}

export default CommentItem;
