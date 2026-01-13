import React from "react";
import { Modal, ConfirmModal, Button } from "../../../shared/components/ui";

const CommentModals = ({
	isDeleteCommentModalOpen,
	setIsDeleteCommentModalOpen,
	handleDeleteComment,
	replyToDelete,
	setReplyToDelete,
	handleDeleteReply,
	editingComment,
	setEditingComment,
	editContent,
	setEditContent,
	handleUpdateComment,
	editingReply,
	setEditingReply,
	editReplyContent,
	setEditReplyContent,
	handleUpdateReply,
}) => {
	return (
		<>
			<ConfirmModal
				isOpen={isDeleteCommentModalOpen}
				onClose={() => setIsDeleteCommentModalOpen(false)}
				onConfirm={() => {
					handleDeleteComment();
					setIsDeleteCommentModalOpen(false);
				}}
				title="Delete Comment"
				message="Are you sure you want to delete this comment?"
			/>

			<ConfirmModal
				isOpen={!!replyToDelete}
				onClose={() => setReplyToDelete(null)}
				onConfirm={handleDeleteReply}
				title="Delete Reply"
				message="Are you sure you want to delete this reply?"
			/>

			<Modal
				isOpen={!!editingComment}
				onClose={() => setEditingComment(null)}
				title="Edit Comment"
			>
				<div className="space-y-4">
					<textarea
						className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					/>
					<div className="flex justify-end gap-3">
						<Button variant="secondary" onClick={() => setEditingComment(null)}>
							Cancel
						</Button>
						<Button onClick={handleUpdateComment}>Save Changes</Button>
					</div>
				</div>
			</Modal>

			<Modal
				isOpen={!!editingReply}
				onClose={() => setEditingReply(null)}
				title="Edit Reply"
			>
				<div className="space-y-4">
					<textarea
						className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
						value={editReplyContent}
						onChange={(e) => setEditReplyContent(e.target.value)}
					/>
					<div className="flex justify-end gap-3">
						<Button variant="secondary" onClick={() => setEditingReply(null)}>
							Cancel
						</Button>
						<Button onClick={handleUpdateReply}>Save Changes</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CommentModals;
