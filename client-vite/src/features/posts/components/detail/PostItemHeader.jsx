import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
	HiDotsHorizontal,
	HiOutlinePencil,
	HiOutlineTrash,
} from "react-icons/hi";
import { Dropdown, DropdownItem } from "../../../../shared/components/ui";

const PostItemHeader = ({
	post,
	isOwner,
	isShare,
	displayUser,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
}) => {
	const userToDisplay = displayUser || post.userId;
	const dateToDisplay = isShare ? post.shareDate : post.createdAt;

	return (
		<div className="flex justify-between items-start gap-2">
			<div className="flex items-center gap-1 min-w-0 flex-wrap sm:flex-nowrap">
				<Link
					to={`/profile/${userToDisplay?._id}`}
					className="font-bold text-[15px] text-slate-900 dark:text-white hover:underline flex items-center gap-1 leading-tight truncate shrink-0"
					onClick={(e) => e.stopPropagation()}
				>
					{userToDisplay?.firstName} {userToDisplay?.lastName}
				</Link>
				<span className="text-slate-500 dark:text-slate-400 text-[14px] truncate shrink min-w-[50px]">
					@{userToDisplay?.username || userToDisplay?.firstName?.toLowerCase()}
				</span>

				<div className="flex items-center gap-1 shrink-0">
					{isShare && (
						<span className="text-primary font-bold text-[11px] uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/50">
							reposted
						</span>
					)}
					<span className="text-slate-400 dark:text-slate-600">·</span>
					<span className="text-slate-500 dark:text-slate-400 text-[14px] whitespace-nowrap">
						{dateToDisplay && !isNaN(new Date(dateToDisplay).getTime())
							? formatDistanceToNow(new Date(dateToDisplay), {
									addSuffix: true,
							  })
							: "just now"}
					</span>
				</div>
			</div>

			{isOwner && (
				<Dropdown
					trigger={
						<button className="text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-full transition-colors">
							<HiDotsHorizontal size={18} />
						</button>
					}
				>
					<DropdownItem
						icon={HiOutlinePencil}
						onClick={(e) => {
							e.stopPropagation();
							setIsEditModalOpen(true);
						}}
					>
						Edit Post
					</DropdownItem>
					<DropdownItem
						variant="danger"
						icon={HiOutlineTrash}
						onClick={(e) => {
							e.stopPropagation();
							setIsDeleteModalOpen(true);
						}}
					>
						Delete Post
					</DropdownItem>
				</Dropdown>
			)}
		</div>
	);
};

export default PostItemHeader;
