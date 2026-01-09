import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import InputEmoji from "react-input-emoji";
import { Avatar, Button, Spinner } from "../../../shared/components/UI";
import { useUser } from "../../../shared/hooks/useUser";
import { useAddComment } from "../hooks/useCommentQueries";
import CommentItem from "./CommentItem";

function CommentList({ comments, postId }) {
	const [text, setText] = useState("");
	const { user } = useUser();
	const { mutate: addComment, isLoading } = useAddComment();

	const handleSubmit = () => {
		if (!text.trim()) return;

		addComment(
			{
				postId,
				commentData: { commentBody: text },
			},
			{
				onSuccess: () => {
					setText("");
					toast.success("Comment added!");
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
				<div className="flex gap-3">
					<Avatar src={user?.image?.secure_url} size="sm" />
					<div className="flex-1">
						<InputEmoji
							value={text}
							onChange={setText}
							cleanOnEnter
							onEnter={handleSubmit}
							placeholder="Post your reply"
							fontSize={15}
							fontFamily="inherit"
							borderColor="transparent"
							theme={
								document.documentElement.classList.contains("dark")
									? "dark"
									: "light"
							}
						/>
						<div className="flex justify-end mt-2">
							<Button
								size="sm"
								disabled={!text.trim() || isLoading}
								onClick={handleSubmit}
								className="rounded-full px-4 font-bold"
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
