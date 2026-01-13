import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { HiDotsHorizontal, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Dropdown, DropdownItem } from "../../../shared/components/ui";

const CommentHeader = ({ comment, isCommentOwner, onEdit, onDelete }) => {
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-2 flex-wrap">
				<Link
					to={`/profile/${comment.userId?._id}`}
					className="font-bold text-slate-900 dark:text-white hover:underline"
				>
					{comment.userId?.firstName} {comment.userId?.lastName}
				</Link>
				<span className="text-sm text-slate-500">
					{comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
						? formatDistanceToNow(new Date(comment.createdAt))
						: "just now"}
				</span>
			</div>

			{isCommentOwner && (
				<Dropdown
					trigger={
						<button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
							<HiDotsHorizontal size={20} />
						</button>
					}
				>
					<DropdownItem
						onClick={onEdit}
						icon={<HiOutlinePencil size={18} />}
					>
						Edit Comment
					</DropdownItem>
					<DropdownItem
						onClick={onDelete}
						icon={<HiOutlineTrash size={18} />}
						variant="danger"
					>
						Delete Comment
					</DropdownItem>
				</Dropdown>
			)}
		</div>
	);
};

export default CommentHeader;
