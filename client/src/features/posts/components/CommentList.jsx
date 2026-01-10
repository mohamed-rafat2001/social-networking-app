import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import InputEmoji from "react-input-emoji";
import { Avatar, Button, Spinner, cn } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useAddComment } from "../hooks/useCommentQueries";
import CommentItem from "./CommentItem";

function CommentList({ comments, postId, recipientId }) {
	const [text, setText] = useState("");
	const { user } = useUser();
	const { darkMode } = useTheme();
	const { socket } = useSocket();
	const { mutate: addComment, isLoading } = useAddComment();

	const handleSubmit = () => {
		if (!text.trim()) return;

		addComment(
			{
				postId,
				commentData: { commentBody: text },
			},
			{
				onSuccess: (response) => {
					setText("");
					toast.success("Comment added!");

					// Emit socket event for notification
					if (socket && recipientId && recipientId !== user?._id) {
						socket.emit("sendNotification", {
							recipientId,
							notification: {
								type: "comment",
								sender: user,
								post: { _id: postId },
								content: text,
								createdAt: new Date(),
								read: false,
							},
						});
					}
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to add comment");
				},
			}
		);
	};

	return (
		<div className="w-full">
			{/* Add Comment Form */}
			<div className="p-4 border-b dark:border-gray-800">
				<div className="flex gap-4">
					<Avatar src={user?.image?.secure_url} size="md" />
					<div className="flex-1 min-w-0">
						<div className="emoji-input-container bg-gray-50 dark:bg-gray-800/50 rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-800 border border-transparent focus-within:border-primary/20 transition-all px-2">
							<InputEmoji
								value={text}
								onChange={setText}
								cleanOnEnter
								onEnter={handleSubmit}
								placeholder="Post your reply"
								fontSize={15}
								fontFamily="inherit"
								borderColor="transparent"
								theme={darkMode ? "dark" : "light"}
								background={darkMode ? "#1f2937" : "#f9fafb"}
								color={darkMode ? "#f3f4f6" : "#1f2937"}
								placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
							/>
						</div>
						<div className="flex justify-end mt-3">
							<Button
								size="sm"
								disabled={!text.trim() || isLoading}
								onClick={handleSubmit}
								className="rounded-full px-5 font-bold shadow-md shadow-primary/10"
							>
								{isLoading ? <Spinner size="xs" variant="white" /> : "Reply"}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Comments List */}
			<div className="flex flex-col">
				<AnimatePresence initial={false}>
					{comments.length > 0 ? (
						comments.map((comment) => (
							<CommentItem
								key={comment._id}
								comment={comment}
								postId={postId}
							/>
						))
					) : (
						<div className="p-8 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								No replies yet.
							</p>
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

export default CommentList;
