import React from "react";
import { cn } from "../../../../shared/components/ui";

const ProfileTabs = ({
	activeTab,
	setActiveTab,
	userPostsCount,
	followersCount,
	followingCount,
	handleFollowsClick,
}) => {
	return (
		<div className="flex items-center gap-2 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 w-fit mx-auto md:mx-0">
			<button
				onClick={() => setActiveTab("posts")}
				className={cn(
					"px-8 py-3 rounded-[2rem] text-sm font-black transition-all duration-300 flex items-center gap-3",
					activeTab === "posts"
						? "bg-white dark:bg-slate-950 text-primary shadow-sm"
						: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
				)}
			>
				<span>Posts</span>
				<span
					className={cn(
						"px-2 py-0.5 rounded-lg text-[10px]",
						activeTab === "posts"
							? "bg-primary/10"
							: "bg-slate-200 dark:bg-slate-700"
					)}
				>
					{userPostsCount}
				</span>
			</button>
			<button
				onClick={() => handleFollowsClick("followers")}
				className="px-8 py-3 rounded-[2rem] text-sm font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-300 flex items-center gap-3"
			>
				<span>Followers</span>
				<span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-200 dark:bg-slate-700">
					{followersCount}
				</span>
			</button>
			<button
				onClick={() => handleFollowsClick("following")}
				className="px-8 py-3 rounded-[2rem] text-sm font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-300 flex items-center gap-3"
			>
				<span>Following</span>
				<span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-200 dark:bg-slate-700">
					{followingCount}
				</span>
			</button>
		</div>
	);
};

export default ProfileTabs;
