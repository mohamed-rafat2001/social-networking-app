import React from "react";
import InputEmoji from "react-input-emoji";
import { formatDistanceToNow } from "date-fns";
import { Avatar, Modal, Button } from "../../../../shared/components/ui";

const RepostModal = ({
	isOpen,
	onClose,
	post,
	user,
	darkMode,
	repostNote,
	onRepostNoteChange,
	onConfirm,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Repost with note" size="lg">
			<div className="space-y-4" onClick={(e) => e.stopPropagation()}>
				<div className="flex gap-3">
					<Avatar src={user?.image?.secure_url} size="md" />
					<div className="flex-1">
						<div className="repost-emoji-input emoji-input-container relative z-[60]">
							<style>
								{`
									.repost-emoji-input .react-input-emoji--container {
										background: transparent !important;
										border: none !important;
										margin-bottom: 0 !important;
									}
									.repost-emoji-input .react-input-emoji--wrapper {
										background: transparent !important;
										border: none !important;
										padding: 0 !important;
									}
									.repost-emoji-input .react-input-emoji--input {
										background: transparent !important;
										padding: 8px 0 !important;
										color: ${darkMode ? "white" : "#0f172a"} !important;
										min-height: 40px !important;
										max-height: 120px !important;
										overflow-y: auto !important;
									}
									.repost-emoji-input .react-input-emoji--button {
										padding: 8px !important;
										z-index: 100 !important;
									}
									.repost-emoji-input .react-input-emoji--picker-wrapper {
										z-index: 1000 !important;
										position: absolute !important;
										bottom: 100% !important;
										right: 0 !important;
									}
								`}
							</style>
							<InputEmoji
								value={repostNote}
								onChange={onRepostNoteChange}
								placeholder="Add a comment..."
								theme={darkMode ? "dark" : "light"}
								fontSize={15}
								fontFamily="inherit"
								borderColor="transparent"
								background="transparent"
								color={darkMode ? "#ffffff" : "#0f172a"}
								placeholderColor={darkMode ? "#94a3b8" : "#64748b"}
							/>
						</div>
					</div>
				</div>

				{/* Original Post Preview */}
				<div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30 dark:bg-slate-900/20 transition-all shadow-sm">
					<div className="flex gap-2 items-center mb-2">
						<Avatar src={post.userId?.image?.secure_url} size="xs" />
						<div className="flex items-center gap-1.5 min-w-0">
							<span className="font-bold text-[14px] text-slate-900 dark:text-white truncate">
								{post.userId?.firstName} {post.userId?.lastName}
							</span>
							<span className="text-slate-500 dark:text-slate-500 text-[13px] truncate">
								@
								{post.userId?.username || post.userId?.firstName?.toLowerCase()}
							</span>
							<span className="text-slate-400 dark:text-slate-600">·</span>
							<span className="text-slate-500 dark:text-slate-500 text-[13px] whitespace-nowrap">
								{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
									? formatDistanceToNow(new Date(post.createdAt))
									: "just now"}
							</span>
						</div>
					</div>
					<p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4 break-words whitespace-pre-wrap">
						{post.text}
					</p>
					{post.images?.length > 0 && (
						<div className="mt-3 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
							<img
								src={post.images[0].secure_url}
								alt="Post preview"
								className="w-full h-40 object-cover"
							/>
						</div>
					)}
				</div>

				<div className="flex justify-end gap-3 pt-2">
					<Button
						variant="secondary"
						onClick={onClose}
						className="rounded-full px-5"
					>
						Cancel
					</Button>
					<Button onClick={onConfirm} className="rounded-full px-6">
						Repost
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default RepostModal;
