import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { HiHeart, HiDotsHorizontal, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Avatar, Dropdown, DropdownItem, cn } from "../../../shared/components/ui";

const CommentReply = ({ 
	reply, 
	commentId, 
	user, 
	darkMode, 
	onLike, 
	onEdit, 
	onDelete 
}) => {
	const isReplyOwner = user?._id === reply.userId?._id;
	const hasLikedReply = reply.likes?.some((id) => String(id) === String(user?._id));

	return (
		<div className="flex gap-3 py-3 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
			<Avatar src={reply.userId?.image?.secure_url} size="sm" />
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 flex-wrap">
						<Link
							to={`/profile/${reply.userId?._id}`}
							className="font-bold text-sm text-slate-900 dark:text-white hover:underline"
						>
							{reply.userId?.firstName} {reply.userId?.lastName}
						</Link>
						<span className="text-xs text-slate-500">
							{reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
								? formatDistanceToNow(new Date(reply.createdAt))
								: "just now"}
						</span>
					</div>
					{isReplyOwner && (
						<Dropdown
							trigger={
								<button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
									<HiDotsHorizontal size={16} />
								</button>
							}
						>
							<DropdownItem
								onClick={() => onEdit(reply)}
								icon={<HiOutlinePencil size={16} />}
							>
								Edit Reply
							</DropdownItem>
							<DropdownItem
								onClick={() => onDelete(commentId, reply._id)}
								icon={<HiOutlineTrash size={16} />}
								variant="danger"
							>
								Delete Reply
							</DropdownItem>
						</Dropdown>
					)}
				</div>
				<p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
					{reply.replayBody}
				</p>
				<div className="flex items-center gap-4 mt-2">
					<button
						onClick={() => onLike(commentId, reply._id)}
						className={cn(
							"flex items-center gap-1.5 text-xs font-medium transition-all hover:scale-105",
							hasLikedReply
								? "text-rose-500"
								: "text-slate-500 hover:text-rose-500"
						)}
					>
						<HiHeart
							className={cn("w-4 h-4", hasLikedReply ? "fill-current" : "")}
						/>
						{reply.likes?.length || 0}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentReply;
