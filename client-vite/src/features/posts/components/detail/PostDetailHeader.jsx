import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../../shared/components/ui";
import { HiDotsHorizontal } from "react-icons/hi";

const PostDetailHeader = ({ post, isOwner, onEdit, onDelete, isMinimal }) => {
	const user = post.userId;
	if (!user) return null;

	if (isMinimal) {
		return (
			<div className="flex items-center gap-3">
				<Avatar src={user.image?.secure_url} size="sm" />
				<div className="flex flex-col min-w-0">
					<span className="font-bold text-sm text-slate-900 dark:text-white leading-tight truncate">
						{user.firstName} {user.lastName}
					</span>
					<span className="text-slate-500 text-[13px] truncate">
						{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
							? formatDistanceToNow(new Date(post.createdAt), {
									addSuffix: true,
							  })
							: "just now"}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start justify-between p-4">
			<div className="flex gap-3 min-w-0">
				<Link to={`/profile/${user._id}`} className="shrink-0">
					<Avatar src={user.image?.secure_url} size="md" />
				</Link>
				<div className="flex flex-col min-w-0">
					<Link
						to={`/profile/${user._id}`}
						className="font-black text-[17px] text-slate-900 dark:text-white hover:text-primary transition-colors leading-tight truncate"
					>
						{user.firstName} {user.lastName}
					</Link>
					<span className="text-slate-500 dark:text-slate-400 text-[15px] truncate">
						@{user.username || user.firstName?.toLowerCase()}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2 shrink-0">
				{isOwner && (
					<div className="relative group">
						<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-primary">
							<HiDotsHorizontal size={20} />
						</button>
						<div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 hidden group-hover:block z-50">
							<button
								onClick={onEdit}
								className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
							>
								Edit post
							</button>
							<button
								onClick={onDelete}
								className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
							>
								Delete post
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default PostDetailHeader;
