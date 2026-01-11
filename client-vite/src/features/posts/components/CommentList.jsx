import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import InputEmoji from "react-input-emoji";
import { Avatar, Button, Spinner, cn } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useAddComment } from "../hooks/useCommentQueries";
import CommentItem from "./CommentItem";

const commentSchema = z.object({
	text: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(1000, "Comment cannot exceed 1000 characters"),
});

function CommentList({ comments, postId, recipientId }) {
	const { user } = useUser();
	const { darkMode } = useTheme();
	const { socket } = useSocket();
	const { mutate: addComment, isLoading } = useAddComment();

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			text: "",
		},
		mode: "onChange",
	});

	const text = watch("text");

	const onSubmit = (data) => {
		if (!data.text.trim()) return;

		addComment(
			{
				postId,
				commentData: { commentBody: data.text },
				postAuthorId: recipientId,
			},
			{
				onSuccess: () => {
					reset();
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
				<div className="flex gap-4">
					<Avatar src={user?.image?.secure_url} size="md" />
					<div className="flex-1 min-w-0">
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="emoji-input-container bg-gray-50 dark:bg-gray-800/50 rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-800 border border-transparent focus-within:border-primary/20 transition-all px-2 relative z-[60]">
								<style>
									{`
										.emoji-input-container .react-input-emoji--picker-wrapper {
											z-index: 1000 !important;
											position: absolute !important;
											bottom: 100% !important;
											right: 0 !important;
										}
										.emoji-input-container .react-input-emoji--button {
											z-index: 100 !important;
										}
									`}
								</style>
								<Controller
									name="text"
									control={control}
									render={({ field }) => (
										<InputEmoji
											value={field.value}
											onChange={field.onChange}
											cleanOnEnter
											onEnter={() => handleSubmit(onSubmit)()}
											placeholder="Post your reply"
											fontSize={15}
											fontFamily="inherit"
											borderColor="transparent"
											theme={darkMode ? "dark" : "light"}
											background={darkMode ? "#1f2937" : "#f9fafb"}
											color={darkMode ? "#f3f4f6" : "#1f2937"}
											placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
										/>
									)}
								/>
							</div>
							{errors.text && (
								<p className="text-xs text-red-500 mt-1 px-2">
									{errors.text.message}
								</p>
							)}
							<div className="flex justify-end mt-3">
								<Button
									type="submit"
									size="sm"
									disabled={!text.trim() || isLoading}
									className="rounded-full px-5 font-bold shadow-md shadow-primary/10"
								>
									{isLoading ? <Spinner size="xs" variant="white" /> : "Reply"}
								</Button>
							</div>
						</form>
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
