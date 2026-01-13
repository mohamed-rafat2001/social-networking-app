import React from "react";
import { motion } from "framer-motion";
import {
	HiHeart,
	HiChatAlt2,
	HiRefresh,
	HiChartBar,
	HiOutlinePencilAlt,
} from "react-icons/hi";
import { cn, Dropdown, DropdownItem } from "../../../../shared/components/ui";

const PostDetailActions = ({
	post,
	user,
	handleLike,
	handleRepost,
	setIsRepostModalOpen,
}) => {
	// showStats is true for everything now because the backend handles which stats to send
	const showStats = true;
	const isLiked = post.likes?.some((like) => (like._id || like) === user?._id);
	const isShared = post.shares?.some(
		(share) => (share.userId?._id || share.userId) === user?._id
	);

	return (
		<div className="flex items-center justify-between px-2 py-1">
			<motion.button
				className="flex items-center gap-2 text-slate-500 hover:text-primary group transition-all duration-200"
				whileHover={{ scale: 1.05 }}
			>
				<div className="p-2.5 rounded-full group-hover:bg-primary/5 transition-colors">
					<HiChatAlt2 size={22} />
				</div>
				{showStats && (
					<span className="text-[14px] font-bold">
						{post.comments?.length || 0}
					</span>
				)}
			</motion.button>

			{/* Share button with dropdown */}
			<Dropdown
				trigger={
					<motion.button
						className={cn(
							"flex items-center gap-2 transition-all duration-200 hover:text-green-500 group",
							isShared ? "text-green-500" : "text-slate-500"
						)}
						whileHover={{ scale: 1.05 }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-2.5 rounded-full group-hover:bg-green-500/5 transition-colors">
							<HiRefresh size={22} />
						</div>
						{showStats && (
							<span className="text-[14px] font-bold">
								{post.shares?.length || 0}
							</span>
						)}
					</motion.button>
				}
				align="left"
			>
				<DropdownItem
					icon={HiRefresh}
					onClick={(e) => {
						e.stopPropagation();
						if (handleRepost) {
							handleRepost();
						}
					}}
				>
					Repost
				</DropdownItem>
				<DropdownItem
					icon={HiOutlinePencilAlt}
					onClick={(e) => {
						e.stopPropagation();
						setIsRepostModalOpen(true);
					}}
				>
					Quote
				</DropdownItem>
			</Dropdown>

			<motion.button
				className={cn(
					"flex items-center gap-2 hover:text-pink-500 group transition-all duration-200",
					isLiked ? "text-pink-500" : "text-slate-500"
				)}
				onClick={handleLike}
				whileHover={{ scale: 1.05 }}
			>
				<div className="p-2.5 rounded-full group-hover:bg-pink-500/5 transition-colors">
					<HiHeart size={22} className={cn(isLiked && "fill-current")} />
				</div>
				{showStats && (
					<span className="text-[14px] font-bold">{post.likesNumber || 0}</span>
				)}
			</motion.button>

			<div className="flex items-center gap-2 text-slate-500">
				<div className="p-2.5">
					<HiChartBar size={21} />
				</div>
				{showStats && (
					<span className="text-[14px] font-bold">{post.views || 0}</span>
				)}
			</div>
		</div>
	);
};

export default PostDetailActions;
