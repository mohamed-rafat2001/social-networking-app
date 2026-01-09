import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiHeart, HiDotsHorizontal, HiChatAlt2 } from "react-icons/hi";
import { useState } from "react";
import { Avatar, Button, Spinner } from "../../../shared/components/UI";
import { useUser } from "../../../shared/hooks/useUser";
import {
	useLikeComment,
	useAddReply,
	useLikeReply,
} from "../hooks/useCommentQueries";
import InputEmoji from "react-input-emoji";
import { toast } from "react-hot-toast";

function CommentItem({ comment, postId }) {
	const { user } = useUser();
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyText, setReplyText] = useState("");
	const { mutate: likeComment } = useLikeComment();
	const { mutate: addReply, isLoading: isReplying } = useAddReply();
	const { mutate: likeReply } = useLikeReply();

	const handleLike = () => {
		likeComment({ commentId: comment._id, postId });
	};

	const handleReplySubmit = () => {
		if (!replyText.trim()) return;

		addReply(
			{
				commentId: comment._id,
				replyData: { replayBody: replyText },
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
					<div className="flex justify-between items-center mb-1">
						<div className="flex items-center gap-1 flex-wrap">
							<Link
								to={`/profile/${comment.userId?._id}`}
								className="font-bold text-sm text-black dark:text-white hover:underline cursor-pointer"
							>
								{comment.userId?.firstName} {comment.userId?.lastName}
							</Link>
							<span className="text-gray-500 dark:text-gray-400 text-xs">
								@{comment.userId?.firstName?.toLowerCase()}
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-xs">
								·
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-xs">
								{comment.createdAt &&
								!isNaN(new Date(comment.createdAt).getTime())
									? formatDistanceToNow(new Date(comment.createdAt), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
						<button className="text-gray-500 hover:text-primary p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
							<HiDotsHorizontal className="text-sm" />
						</button>
					</div>

					<p className="text-sm text-black dark:text-gray-200 break-words mb-3">
						{comment.commentBody}
					</p>

					{comment.image?.secure_url && (
						<div className="rounded-xl overflow-hidden border dark:border-gray-800 mb-3 max-w-sm">
							<img
								src={comment.image.secure_url}
								alt="Comment"
								className="w-full h-auto"
							/>
						</div>
					)}

					<div className="flex gap-6 text-gray-500 dark:text-gray-400">
						<button
							onClick={() => setShowReplyInput(!showReplyInput)}
							className={`flex items-center gap-1.5 hover:text-primary group transition-colors ${
								showReplyInput ? "text-primary" : ""
							}`}
						>
							<div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
								<HiChatAlt2 className="text-base" />
							</div>
							<span className="text-xs">{comment.replies?.length || 0}</span>
						</button>
						<button
							onClick={handleLike}
							className={`flex items-center gap-1.5 hover:text-pink-500 group transition-colors ${
								comment.like?.includes(user?._id) ? "text-pink-500" : ""
							}`}
						>
							<div className="p-1.5 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
								<HiHeart
									className={`text-base ${
										comment.like?.includes(user?._id) ? "text-pink-500" : ""
									}`}
								/>
							</div>
							<span className="text-xs">{comment.likeNum || 0}</span>
						</button>
					</div>

					{/* Replies List */}
					{comment.replies?.length > 0 && (
						<div className="mt-4 space-y-4 ml-2 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
							{comment.replies.map((reply) => (
								<div key={reply._id} className="flex gap-3">
									<Link
										to={`/profile/${reply.userId?._id}`}
										className="shrink-0"
									>
										<Avatar src={reply.userId?.image?.secure_url} size="xs" />
									</Link>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-1 mb-1">
											<Link
												to={`/profile/${reply.userId?._id}`}
												className="font-bold text-xs text-black dark:text-white hover:underline"
											>
												{reply.userId?.firstName} {reply.userId?.lastName}
											</Link>
											<span className="text-gray-500 dark:text-gray-400 text-[10px]">
												·{" "}
												{reply.createdAt &&
												!isNaN(new Date(reply.createdAt).getTime())
													? formatDistanceToNow(new Date(reply.createdAt), {
															addSuffix: true,
													  })
													: "just now"}
											</span>
										</div>
										<p className="text-xs text-black dark:text-gray-200 break-words mb-2">
											{reply.replayBody}
										</p>
										<div className="flex gap-4 text-gray-500 dark:text-gray-400">
											<button
												onClick={() =>
													likeReply({ replyId: reply._id, postId })
												}
												className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${
													reply.like?.includes(user?._id) ? "text-pink-500" : ""
												}`}
											>
												<HiHeart className="text-xs" />
												<span className="text-[10px]">
													{reply.likeNum || 0}
												</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Reply Input */}
					<AnimatePresence>
						{showReplyInput && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="mt-4 overflow-hidden"
							>
								<div className="flex gap-2">
									<Avatar src={user?.image?.secure_url} size="xs" />
									<div className="flex-1">
										<InputEmoji
											value={replyText}
											onChange={setReplyText}
											cleanOnEnter
											onEnter={handleReplySubmit}
											placeholder="Post your reply"
											fontSize={13}
											theme={
												document.documentElement.classList.contains("dark")
													? "dark"
													: "light"
											}
										/>
										<div className="flex justify-end mt-1">
											<Button
												size="sm"
												disabled={!replyText.trim() || isReplying}
												onClick={handleReplySubmit}
												className="rounded-full h-8 text-xs px-4"
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
		</motion.div>
	);
}

export default CommentItem;
