import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
	HiDotsHorizontal,
	HiOutlinePencil,
	HiOutlineTrash,
} from "react-icons/hi";
import {
	Avatar,
	Dropdown,
	DropdownItem,
} from "../../../../shared/components/ui";

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
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-1 flex-wrap">
				<Link
					to={`/profile/${userToDisplay?._id}`}
					className="font-bold text-[15px] text-gray-900 dark:text-white hover:underline flex items-center gap-2 leading-tight"
					onClick={(e) => e.stopPropagation()}
				>
					{userToDisplay?.firstName} {userToDisplay?.lastName}
				</Link>
				<span className="text-gray-500 dark:text-gray-400 text-[14px]">
					@{userToDisplay?.username || userToDisplay?.firstName?.toLowerCase()}
				</span>
				{isShare && (
					<span className="text-primary font-medium text-[13px] ml-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
						reposted
					</span>
				)}
				<span className="text-gray-500 dark:text-gray-400">·</span>
				<span className="text-gray-500 dark:text-gray-400 text-[14px]">
					{dateToDisplay && !isNaN(new Date(dateToDisplay).getTime())
						? formatDistanceToNow(new Date(dateToDisplay), {
								addSuffix: true,
						  })
						: "just now"}
				</span>
			</div>

			{isOwner && (
				<Dropdown
					trigger={
						<button className="text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
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
