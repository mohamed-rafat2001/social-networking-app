import React from "react";
import { motion } from "framer-motion";
import { HiChatAlt2, HiRefresh, HiHeart, HiChartBar } from "react-icons/hi";
import { cn } from "../../../../shared/components/ui";

const PostItemActions = ({
	post,
	user,
	handleLike,
	setIsRepostModalOpen,
	goToDetail,
}) => {
	const isLiked = post.likes?.some((like) => (like._id || like) === user?._id);
	const isShared = post.shares?.some(
		(share) => (share.userId?._id || share.userId) === user?._id
	);

	return (
		<div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mt-3 max-w-md -ml-2">
			<motion.button
				className="flex items-center gap-1 hover:text-primary group transition-all duration-200"
				whileHover={{ scale: 1.02 }}
				onClick={(e) => {
					e.stopPropagation();
					goToDetail();
				}}
			>
				<div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
					<HiChatAlt2 size={18} />
				</div>
				<span className="text-[13px] font-medium group-hover:opacity-100">
					{post.comments?.length || 0}
				</span>
			</motion.button>

			<motion.button
				className={cn(
					"flex items-center gap-1 transition-all duration-200 hover:text-emerald-500 group",
					isShared && "text-emerald-500"
				)}
				whileHover={{ scale: 1.02 }}
				onClick={(e) => {
					e.stopPropagation();
					setIsRepostModalOpen(true);
				}}
			>
				<div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
					<HiRefresh
						size={18}
						className={cn(
							isShared && "rotate-180 transition-transform duration-500"
						)}
					/>
				</div>
				<span className="text-[13px] font-medium">
					{post.shares?.length || 0}
				</span>
			</motion.button>

			<motion.button
				className={cn(
					"flex items-center gap-1 hover:text-rose-500 group transition-all duration-200",
					isLiked && "text-rose-500"
				)}
				onClick={handleLike}
				whileHover={{ scale: 1.02 }}
			>
				<div className="p-2 rounded-full group-hover:bg-rose-500/10 transition-colors">
					<HiHeart
						size={18}
						className={cn(
							isLiked && "fill-current scale-110 transition-transform"
						)}
					/>
				</div>
				<span className="text-[13px] font-medium">{post.likesNumber || 0}</span>
			</motion.button>

			<div className="flex items-center gap-1 text-slate-400 dark:text-gray-500">
				<div className="p-2">
					<HiChartBar size={18} />
				</div>
				<span className="text-[13px] font-medium">{post.views || 0}</span>
			</div>
		</div>
	);
};

export default PostItemActions;
