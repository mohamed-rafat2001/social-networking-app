import React from "react";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "../../../shared/components/ui";
import PostItem from "./PostItem";

const PostFeed = React.forwardRef(({ 
	posts, 
	isPostsLoading, 
	isFetchingNextPage, 
	hasNextPage, 
	feedType 
}, ref) => {
	return (
		<div className="divide-y divide-slate-100 dark:divide-slate-800/50">
			<AnimatePresence initial={false}>
				{isPostsLoading ? (
					<div className="flex justify-center items-center p-12">
						<Spinner size="lg" />
					</div>
				) : posts.length > 0 ? (
					<>
						{posts.map((post) => (
							<PostItem key={post._id} post={post} />
						))}
						{/* Infinite Scroll Trigger */}
						<div ref={ref} className="py-8 flex justify-center items-center">
							{isFetchingNextPage ? (
								<div className="flex flex-col items-center gap-2">
									<div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
									<span className="text-xs font-medium text-slate-400">
										Loading more posts...
									</span>
								</div>
							) : hasNextPage ? (
								<div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
							) : (
								<div className="py-4 text-center">
									<p className="text-sm font-medium text-slate-400">
										No more posts to show
									</p>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
						<div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
							{feedType === "following"
								? "No posts from people you follow"
								: "No posts yet"}
						</h3>
						<p className="text-slate-500 dark:text-slate-400 max-w-xs">
							{feedType === "following"
								? "When people you follow share posts, they'll show up here."
								: "Be the first one to share something with the world!"}
						</p>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
});

PostFeed.displayName = "PostFeed";

export default PostFeed;
