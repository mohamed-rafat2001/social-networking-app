import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
	HiHeart,
	HiDotsHorizontal,
	HiChatAlt2,
	HiOutlinePencil,
	HiOutlineTrash,
} from "react-icons/hi";
import {
	Avatar,
	Button,
	Spinner,
	ImageGallery,
	cn,
	Dropdown,
	DropdownItem,
	Modal,
	ConfirmModal,
} from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import {
	useLikeComment,
	useAddReply,
	useLikeReply,
	useUpdateComment,
	useDeleteComment,
	useUpdateReply,
	useDeleteReply,
} from "../hooks/useCommentQueries";
import InputEmoji from "react-input-emoji";
import { toast } from "react-hot-toast";

function CommentItem({ comment, postId }) {
	const { user } = useUser();
	const { darkMode } = useTheme();
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyText, setReplyText] = useState("");

	const [editingComment, setEditingComment] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [editingReply, setEditingReply] = useState(null);
	const [editReplyContent, setEditReplyContent] = useState("");
	const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
		useState(false);
	const [replyToDelete, setReplyToDelete] = useState(null);

	const { mutate: likeComment } = useLikeComment();
	const { mutate: addReply, isLoading: isReplying } = useAddReply();
	const { mutate: likeReply } = useLikeReply();
	const { mutate: updateComment } = useUpdateComment();
	const { mutate: deleteComment } = useDeleteComment();
	const { mutate: updateReply } = useUpdateReply();
	const { mutate: deleteReply } = useDeleteReply();

	const isCommentOwner = user?._id === comment.userId?._id;

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

	const handleDeleteComment = () => {
		deleteComment(
			{ commentId: comment._id, postId },
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
		if (replyToDelete) {
			deleteReply(
				{ replyId: replyToDelete, postId },
				{
					onSuccess: () => {
						toast.success("Reply deleted");
						setReplyToDelete(null);
					},
				}
			);
		}
	};

	const handleLike = () => {
		likeComment({ commentId: comment._id, postId });
	};

	const handleReplySubmit = () => {
		const textToSubmit = typeof replyText === "string" ? replyText : "";
		if (!textToSubmit.trim()) return;

		addReply(
			{
				commentId: comment._id,
				replyData: { replayBody: textToSubmit },
				postId,
			},
			{
				onSuccess: () => {
					setReplyText("");
					setShowReplyInput(false);
					toast.success("Reply added!");
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to add reply");
				},
			}
		);
	};

	return (
		<motion.div
			className="p-4 border-b dark:border-gray-800 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<div className="flex gap-3">
				<Link to={`/profile/${comment.userId?._id}`} className="shrink-0">
					<Avatar src={comment.userId?.image?.secure_url} size="sm" />
				</Link>
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-center mb-0.5">
						<div className="flex items-center gap-1 flex-wrap">
							<Link
								to={`/profile/${comment.userId?._id}`}
								className="font-bold text-[15px] text-gray-900 dark:text-white hover:underline cursor-pointer leading-tight"
							>
								{comment.userId?.firstName} {comment.userId?.lastName}
							</Link>
							<span className="text-gray-500 dark:text-gray-400 text-[14px]">
								@{comment.userId?.firstName?.toLowerCase()}
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-[14px]">
								·
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-[14px]">
								{comment.createdAt &&
								!isNaN(new Date(comment.createdAt).getTime())
									? formatDistanceToNow(new Date(comment.createdAt), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>

						{isCommentOwner && (
							<div className="ml-auto">
								<Dropdown
									trigger={
										<button className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
											<HiDotsHorizontal size={18} />
										</button>
									}
								>
									<DropdownItem
										icon={HiOutlinePencil}
										onClick={() => {
											setEditingComment(comment);
											setEditContent(comment.commentBody);
										}}
									>
										Edit
									</DropdownItem>
									<DropdownItem
										variant="danger"
										icon={HiOutlineTrash}
										onClick={() => setIsDeleteCommentModalOpen(true)}
									>
										Delete
									</DropdownItem>
								</Dropdown>
							</div>
						)}
					</div>

					<p className="text-[15px] text-gray-900 dark:text-gray-200 leading-normal break-words mb-3 whitespace-pre-wrap">
						{comment.commentBody}
					</p>

					{comment.image?.secure_url && (
						<ImageGallery
							images={[comment.image.secure_url]}
							className="mb-3 max-w-md shadow-sm"
						/>
					)}

					<div className="flex gap-4 items-center">
						<button
							onClick={handleLike}
							className={cn(
								"flex items-center gap-1.5 hover:text-pink-500 group transition-colors",
								comment.like?.includes(user?._id) && "text-pink-500"
							)}
						>
							<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
								<HiHeart
									size={18}
									className={cn(
										comment.like?.includes(user?._id)
											? "text-pink-500"
											: "text-gray-500 dark:text-gray-400"
									)}
								/>
							</div>
							<span className="text-[13px] font-medium">
								{comment.likeNum || 0}
							</span>
						</button>

						<button
							onClick={() => setShowReplyInput(!showReplyInput)}
							className="flex items-center gap-1.5 hover:text-primary group transition-colors text-gray-500 dark:text-gray-400"
						>
							<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
								<HiChatAlt2 size={18} />
							</div>
							<span className="text-[13px] font-medium">
								{comment.replies?.length || 0}
							</span>
						</button>
					</div>

					{/* Replies List */}
					{comment.replies?.length > 0 && (
						<div className="mt-4 space-y-4 ml-1 pl-4 border-l dark:border-gray-800">
							{comment.replies.map((reply) => (
								<div key={reply._id} className="flex gap-3">
									<Link
										to={`/profile/${reply.userId?._id}`}
										className="shrink-0"
									>
										<Avatar src={reply.userId?.image?.secure_url} size="xs" />
									</Link>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-0.5">
											<div className="flex items-center gap-1">
												<Link
													to={`/profile/${reply.userId?._id}`}
													className="font-bold text-[13px] text-gray-900 dark:text-white hover:underline leading-tight"
												>
													{reply.userId?.firstName} {reply.userId?.lastName}
												</Link>
												<span className="text-gray-500 dark:text-gray-400 text-[12px]">
													·{" "}
													{reply.createdAt &&
													!isNaN(new Date(reply.createdAt).getTime())
														? formatDistanceToNow(new Date(reply.createdAt), {
																addSuffix: true,
														  })
														: "just now"}
												</span>
											</div>

											{user?._id === reply.userId?._id && (
												<div className="ml-auto">
													<Dropdown
														trigger={
															<button className="text-gray-500 hover:text-primary p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
																<HiDotsHorizontal size={14} />
															</button>
														}
													>
														<DropdownItem
															icon={HiOutlinePencil}
															onClick={() => {
																setEditingReply(reply);
																setEditReplyContent(reply.replayBody);
															}}
														>
															Edit
														</DropdownItem>
														<DropdownItem
															variant="danger"
															icon={HiOutlineTrash}
															onClick={() => setReplyToDelete(reply._id)}
														>
															Delete
														</DropdownItem>
													</Dropdown>
												</div>
											)}
										</div>
										<p className="text-[14px] text-gray-900 dark:text-gray-200 leading-normal break-words mb-2 whitespace-pre-wrap">
											{reply.replayBody}
										</p>
										<div className="flex gap-4 items-center">
											<button
												onClick={() =>
													likeReply({ replyId: reply._id, postId })
												}
												className={cn(
													"flex items-center gap-1 hover:text-pink-500 group transition-colors",
													reply.like?.includes(user?._id) && "text-pink-500"
												)}
											>
												<div className="p-1 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
													<HiHeart
														size={14}
														className={cn(
															reply.like?.includes(user?._id)
																? "text-pink-500"
																: "text-gray-500 dark:text-gray-400"
														)}
													/>
												</div>
												<span className="text-[11px] font-medium">
													{reply.likeNum || 0}
												</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					<ConfirmModal
						isOpen={isDeleteCommentModalOpen}
						onClose={() => setIsDeleteCommentModalOpen(false)}
						onConfirm={handleDeleteComment}
						title="Delete Comment"
						message="Are you sure you want to delete this comment? This action cannot be undone."
					/>

					<ConfirmModal
						isOpen={!!replyToDelete}
						onClose={() => setReplyToDelete(null)}
						onConfirm={handleDeleteReply}
						title="Delete Reply"
						message="Are you sure you want to delete this reply? This action cannot be undone."
					/>

					{/* Reply Input */}
					<AnimatePresence>
						{showReplyInput && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="mt-4"
							>
								<div className="flex gap-2">
									<Avatar src={user?.image?.secure_url} size="xs" />
									<div className="flex-1 min-w-0">
										<div className="emoji-input-container bg-gray-50 dark:bg-gray-800/50 rounded-xl px-1">
											<InputEmoji
												value={replyText}
												onChange={setReplyText}
												cleanOnEnter
												onEnter={handleReplySubmit}
												placeholder="Post your reply"
												fontSize={14}
												theme={darkMode ? "dark" : "light"}
												background={darkMode ? "#1f2937" : "#f9fafb"}
												color={darkMode ? "#f3f4f6" : "#1f2937"}
												placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
												borderRadius={12}
												borderColor="transparent"
											/>
										</div>
										<div className="flex justify-end mt-2">
											<Button
												size="sm"
												disabled={
													!(
														typeof replyText === "string" && replyText.trim()
													) || isReplying
												}
												onClick={handleReplySubmit}
												className="rounded-full h-7 text-[11px] px-3 font-bold"
											>
												{isReplying ? (
													<Spinner size="xs" variant="white" />
												) : (
													"Reply"
												)}
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Edit Comment Modal */}
			<Modal
				isOpen={!!editingComment}
				onClose={() => setEditingComment(null)}
				title="Edit Comment"
			>
				<div className="space-y-4">
					<textarea
						className="w-full min-h-[120px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
						placeholder="Edit your comment..."
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

			{/* Edit Reply Modal */}
			<Modal
				isOpen={!!editingReply}
				onClose={() => setEditingReply(null)}
				title="Edit Reply"
			>
				<div className="space-y-4">
					<textarea
						className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
						placeholder="Edit your reply..."
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
		</motion.div>
	);
}

export default CommentItem;
