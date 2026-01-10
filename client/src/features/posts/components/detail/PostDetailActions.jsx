import React from "react";
import {
	HiHeart,
	HiChatAlt2,
	HiRefresh,
	HiChartBar,
	HiOutlineChatAlt,
} from "react-icons/hi";
import { cn, Dropdown, DropdownItem } from "../../../../shared/components/ui";

const PostDetailActions = ({
	post,
	user,
	handleLike,
	handleShare,
	setIsRepostModalOpen,
}) => {
	const isLiked = post.likes?.some((like) => (like._id || like) === user?._id);
	const isShared = post.shares?.some(
		(share) => (share.userId?._id || share.userId) === user?._id
	);

	return (
		<div className="px-4">
			<div className="flex items-center justify-between py-4 border-b dark:border-gray-800">
				<div className="flex items-center gap-1">
					<span className="font-bold text-gray-900 dark:text-white">
						{post.views || 0}
					</span>
					<span className="text-gray-500">Views</span>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1">
						<span className="font-bold text-gray-900 dark:text-white">
							{post.likes?.length || 0}
						</span>
						<span className="text-gray-500">Likes</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="font-bold text-gray-900 dark:text-white">
							{post.shares?.length || 0}
						</span>
						<span className="text-gray-500">Reposts</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-around py-2 border-b dark:border-gray-800">
				<button
					onClick={handleLike}
					className={cn(
						"group flex items-center gap-2 p-2 rounded-full transition-all duration-200",
						isLiked
							? "text-red-500"
							: "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
					)}
				>
					<div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
						<HiHeart className={cn("text-xl", isLiked && "fill-current")} />
					</div>
				</button>

				<button className="group flex items-center gap-2 p-2 rounded-full text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
					<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
						<HiChatAlt2 className="text-xl" />
					</div>
				</button>

				<Dropdown
					trigger={
						<button
							className={cn(
								"group flex items-center gap-2 p-2 rounded-full transition-all duration-200",
								isShared
									? "text-green-500"
									: "text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
							)}
						>
							<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
								<HiRefresh className="text-xl" />
							</div>
						</button>
					}
				>
					<DropdownItem
						icon={HiRefresh}
						onClick={(e) => {
							e.stopPropagation();
							handleShare();
						}}
					>
						Repost
					</DropdownItem>
					<DropdownItem
						icon={HiOutlineChatAlt}
						onClick={(e) => {
							e.stopPropagation();
							setIsRepostModalOpen(true);
						}}
					>
						Repost with note
					</DropdownItem>
				</Dropdown>

				<div className="group flex items-center gap-2 p-2 rounded-full text-gray-500">
					<div className="p-2 rounded-full">
						<HiChartBar className="text-xl" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetailActions;
