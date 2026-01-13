import React from "react";
import { HiHeart, HiChatAlt2 } from "react-icons/hi";
import { cn } from "../../../shared/components/ui";

const CommentActions = ({
	likesCount,
	repliesCount,
	hasLiked,
	onLike,
	onToggleReply,
}) => {
	return (
		<div className="flex items-center gap-6 mt-3">
			<button
				onClick={onLike}
				className={cn(
					"flex items-center gap-2 text-sm font-medium transition-all hover:scale-105",
					hasLiked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
				)}
			>
				<HiHeart className={cn("w-5 h-5", hasLiked ? "fill-current" : "")} />
				{likesCount || 0}
			</button>
			<button
				onClick={onToggleReply}
				className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-all hover:scale-105"
			>
				<HiChatAlt2 className="w-5 h-5" />
				{repliesCount || 0}
			</button>
		</div>
	);
};

export default CommentActions;
