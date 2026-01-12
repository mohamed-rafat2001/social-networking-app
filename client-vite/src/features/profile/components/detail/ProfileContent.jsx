import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiDotsHorizontal } from "react-icons/hi";
import { PostItem } from "../../../posts";

const ProfileContent = ({ activeTab, userPosts, isCurrentUser }) => {
	return (
		<div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300 mb-8">
			<AnimatePresence mode="wait">
				{activeTab === "posts" && (
					<motion.div
						key="posts"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="divide-y divide-slate-50 dark:divide-slate-800/50"
					>
						{userPosts.length > 0 ? (
							userPosts.map((post) => <PostItem key={post._id} post={post} />)
						) : (
							<div className="py-24 text-center px-6">
								<div className="bg-primary/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
									<HiDotsHorizontal size={48} className="text-primary/20" />
								</div>
								<h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
									No posts yet
								</h4>
								<p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto text-[15px] leading-relaxed">
									{isCurrentUser
										? "You haven't posted anything yet. Start sharing your thoughts with the community!"
										: "This user hasn't posted anything yet."}
								</p>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ProfileContent;
