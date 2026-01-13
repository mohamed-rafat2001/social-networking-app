import React from "react";
import { motion } from "framer-motion";
import InputEmoji from "react-input-emoji";
import { Avatar, Button, Spinner } from "../../../shared/components/ui";

const CommentReplyInput = ({
	user,
	replyText,
	setReplyText,
	darkMode,
	isReplying,
	onCancel,
	onSubmit,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			className="mt-4"
		>
			<div className="flex gap-3">
				<Avatar src={user?.image?.secure_url} size="sm" />
				<div className="flex-1">
					<div className="repost-emoji-input emoji-input-container relative z-20">
						<style>
							{`
								.repost-emoji-input .react-input-emoji--container {
									background: ${darkMode ? "#1e293b" : "#f1f5f9"} !important;
									border: none !important;
									margin-bottom: 0 !important;
								}
								.repost-emoji-input .react-input-emoji--input {
									color: ${darkMode ? "white" : "#1f2937"} !important;
								}
							`}
						</style>
						<InputEmoji
							value={replyText}
							onChange={setReplyText}
							placeholder="Write a reply..."
							theme={darkMode ? "dark" : "light"}
							fontSize={14}
							fontFamily="inherit"
							borderColor="transparent"
							background="transparent"
						/>
					</div>
					<div className="flex justify-end gap-2 mt-2">
						<Button variant="ghost" size="sm" onClick={onCancel}>
							Cancel
						</Button>
						<Button
							size="sm"
							disabled={!replyText.trim() || isReplying}
							onClick={onSubmit}
						>
							{isReplying ? <Spinner size="xs" /> : "Reply"}
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CommentReplyInput;
