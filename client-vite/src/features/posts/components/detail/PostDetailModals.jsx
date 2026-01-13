import React from "react";
import InputEmoji from "react-input-emoji";
import {
	ConfirmModal,
	Button,
	Textarea,
	Modal,
} from "../../../../shared/components/ui";
import PostDetailHeader from "./PostDetailHeader";

function PostDetailModals({
	post,
	darkMode,
	isDeleteModalOpen,
	setIsDeleteModalOpen,
	handleDelete,
	isEditModalOpen,
	setIsEditModalOpen,
	editContent,
	setEditContent,
	handleUpdate,
	isRepostModalOpen,
	setIsRepostModalOpen,
	repostNote,
	setRepostNote,
	handleRepostWithNote,
}) {
	return (
		<>
			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Post?"
				message="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
				confirmText="Delete"
				variant="danger"
			/>

			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Post"
			>
				<div className="space-y-4">
					<div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
						<Textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="min-h-[150px] bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400"
							placeholder="What's happening?"
						/>
					</div>
					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => setIsEditModalOpen(false)}
							className="rounded-full font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdate}
							className="rounded-full px-8 font-black shadow-lg shadow-primary/20"
						>
							Save Changes
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				isOpen={isRepostModalOpen}
				onClose={() => setIsRepostModalOpen(false)}
				title="Repost with note"
			>
				<div className="space-y-4">
					<div className="post-input-container bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
						<InputEmoji
							value={repostNote}
							onChange={setRepostNote}
							placeholder="Add a comment..."
							theme={darkMode ? "dark" : "light"}
							fontSize={16}
						/>
					</div>
					<div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
						<PostDetailHeader post={post} isOwner={false} isMinimal />
						<div className="mt-3 text-slate-600 dark:text-slate-300 line-clamp-3 text-[15px] leading-relaxed">
							{post?.text}
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => setIsRepostModalOpen(false)}
							className="rounded-full font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
						>
							Cancel
						</Button>
						<Button
							onClick={handleRepostWithNote}
							className="rounded-full px-8 font-black shadow-lg shadow-primary/20"
						>
							Repost
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default PostDetailModals;
