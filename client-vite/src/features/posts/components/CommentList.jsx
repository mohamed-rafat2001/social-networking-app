import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import { useSocket } from "../../../shared/hooks/useSocket";
import CommentItem from "./CommentItem";
import AddCommentForm from "./AddCommentForm";

function CommentList({ comments = [], postId, recipientId }) {
	const { user } = useUser();
	const { darkMode } = useTheme();
	useSocket();

	return (
		<div className="w-full">
			<AddCommentForm
				user={user}
				darkMode={darkMode}
				postId={postId}
				recipientId={recipientId}
			/>

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
							<p className="text-slate-500 dark:text-slate-400">
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
