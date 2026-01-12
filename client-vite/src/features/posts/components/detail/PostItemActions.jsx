import React from "react";
import { motion } from "framer-motion";
import {
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiOutlineChatAlt,
} from "react-icons/hi";
import { cn, Dropdown, DropdownItem } from "../../../../shared/components/ui";

const PostItemActions = ({
	post,
	user,
	handleLike,
	handleRepost,
	setIsRepostModalOpen,
	goToDetail,
}) => {
	// showStats is true for everything now because the backend handles which stats to send
	const showStats = true;
	const isLiked = post.likes?.some((like) => (like._id || like) === user?._id);
	const isShared = post.shares?.some(
		(share) => (share.userId?._id || share.userId) === user?._id
	);

	return (
		<div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mt-3 max-w-md">
			<motion.button
				className="flex items-center gap-1.5 hover:text-primary group transition-all duration-200"
				whileHover={{ scale: 1.05 }}
				onClick={(e) => {
					e.stopPropagation();
					goToDetail();
				}}
			>
				<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
					<HiChatAlt2 size={19} />
				</div>
				{showStats && (
					<span className="text-[13px] font-medium opacity-80 group-hover:opacity-100">
						{post.comments?.length || 0}
					</span>
				)}
			</motion.button>

			{/* Share button */}
			<div className="flex items-center">
				<Dropdown
					align="left"
					trigger={
						<motion.button
							className={cn(
								"flex items-center gap-1.5 transition-all duration-200 hover:text-green-500 group",
								isShared && "text-green-500"
							)}
							whileHover={{ scale: 1.05 }}
						>
							<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
								<HiRefresh size={19} />
							</div>
							{showStats && (
								<span className="text-[13px] font-medium opacity-80 group-hover:opacity-100">
									{post.shares?.length || 0}
								</span>
							)}
						</motion.button>
					}
				>
					<DropdownItem
						icon={HiRefresh}
						onClick={(e) => {
							e.stopPropagation();
							handleRepost();
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
			</div>

			<motion.button
				className={cn(
					"flex items-center gap-1.5 hover:text-pink-500 group transition-all duration-200",
					isLiked && "text-pink-500"
				)}
				onClick={handleLike}
				whileHover={{ scale: 1.05 }}
			>
				<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
					<HiHeart
						size={19}
						className={cn(
							isLiked
								? "text-pink-500 fill-current"
								: "text-gray-500 dark:text-gray-400"
						)}
					/>
				</div>
				{showStats && (
					<span className="text-[13px] font-medium opacity-80 group-hover:opacity-100">
						{post.likesNumber || 0}
					</span>
				)}
			</motion.button>

			<div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 opacity-60">
				<div className="p-2">
					<HiChartBar size={18} />
				</div>
				{showStats && (
					<span className="text-[13px] font-medium">{post.views || 0}</span>
				)}
			</div>
		</div>
	);
};

export default PostItemActions;
