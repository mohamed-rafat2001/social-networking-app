import React from "react";
import InputEmoji from "react-input-emoji";
import { formatDistanceToNow } from "date-fns";
import {
	Avatar,
	Modal,
	ConfirmModal,
	Button,
} from "../../../../shared/components/ui";

const PostItemModals = ({
	post,
	user,
	darkMode,
	isEditModalOpen,
	setIsEditModalOpen,
	isDeleteModalOpen,
	setIsDeleteModalOpen,
	isRepostModalOpen,
	setIsRepostModalOpen,
	editContent,
	setEditContent,
	repostNote,
	setRepostNote,
	handleUpdate,
	handleDelete,
	handleRepostWithNote,
	closeRepostModal,
}) => {
	return (
		<>
			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Post"
				message="Are you sure you want to delete this post? This action cannot be undone."
			/>

			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Post"
			>
				<div className="space-y-4">
					<textarea
						className="w-full min-h-[150px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
						placeholder="What's on your mind?"
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					/>
					<div className="flex justify-end gap-3">
						<Button
							variant="secondary"
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdate}>Save Changes</Button>
					</div>
				</div>
			</Modal>

			<Modal
				isOpen={isRepostModalOpen}
				onClose={closeRepostModal}
				title="Repost with note"
				size="lg"
			>
				<div className="space-y-4" onClick={(e) => e.stopPropagation()}>
					<style>
						{`
							.repost-emoji-input .react-input-emoji--container {
								background: ${darkMode ? "#1f2937" : "#ffffff"} !important;
								border: 1px solid ${darkMode ? "#374151" : "#e5e7eb"} !important;
								margin: 0 !important;
							}
							.repost-emoji-input .react-input-emoji--wrapper {
								background: transparent !important;
								border: none !important;
							}
							.repost-emoji-input .react-input-emoji--input {
								background: transparent !important;
								padding: 12px !important;
								color: ${darkMode ? "#ffffff" : "#000000"} !important;
							}
							.repost-emoji-input .react-input-emoji--button {
								padding: 10px !important;
							}
						`}
					</style>
					<div className="flex gap-3">
						<Avatar src={user?.image?.secure_url} size="md" />
						<div className="flex-1">
							<div className="repost-emoji-input emoji-input-container rounded-xl">
								<InputEmoji
									value={repostNote}
									onChange={setRepostNote}
									placeholder="Add a comment..."
									theme={darkMode ? "dark" : "light"}
									fontSize={15}
									fontFamily="inherit"
									borderColor="transparent"
									background="transparent"
								/>
							</div>
						</div>
					</div>

					{/* Original Post Preview */}
					<div className="border dark:border-gray-700 rounded-2xl p-4 ml-12 bg-gray-50/30 dark:bg-gray-800/20">
						<div className="flex gap-2 items-center mb-2">
							<Avatar src={post.userId?.image?.secure_url} size="sm" />
							<span className="font-bold text-sm text-gray-900 dark:text-white">
								{post.userId?.firstName} {post.userId?.lastName}
							</span>
							<span className="text-gray-500 text-xs">
								·{" "}
								{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
									? formatDistanceToNow(new Date(post.createdAt))
									: "just now"}
							</span>
						</div>
						<p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
							{post.text}
						</p>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							variant="secondary"
							onClick={closeRepostModal}
							className="rounded-full px-5"
						>
							Cancel
						</Button>
						<Button
							onClick={handleRepostWithNote}
							disabled={!repostNote.trim()}
							className="rounded-full px-6"
						>
							Repost
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default PostItemModals;
