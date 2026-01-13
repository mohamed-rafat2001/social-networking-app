import React from "react";

const RightSidebar = () => {
	return (
		<aside className="hidden xl:block w-72 shrink-0">
			<div className="sticky top-24 space-y-6">
				{/* Trending for Engineers */}
				<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
					<h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
						Trending for Engineers
					</h3>
					<div className="space-y-4">
						<TrendingItem
							category="Computer Science"
							tag="#React19_Released"
							posts="1,234"
						/>
						<TrendingItem
							category="Civil Engineering"
							tag="#SmartBridges"
							posts="856"
						/>
						<TrendingItem
							category="Mechanical"
							tag="#EV_Future"
							posts="2,431"
						/>
					</div>
				</div>

				{/* Suggestions */}
				<div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
					<h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
						Who to follow
					</h3>
					<div className="space-y-4">
						<SuggestionItem
							name="Dr. Sarah Chen"
							handle="@sarah_ai"
							avatarClass="bg-primary/10"
						/>
					</div>
				</div>
			</div>
		</aside>
	);
};

const TrendingItem = ({ category, tag, posts }) => (
	<div className="group cursor-pointer">
		<p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
			{category} · Trending
		</p>
		<p className="font-bold text-slate-900 dark:text-white group-hover:underline">
			{tag}
		</p>
		<p className="text-xs text-slate-500 dark:text-slate-400">
			{posts} Posts
		</p>
	</div>
);

const SuggestionItem = ({ name, handle, avatarClass }) => (
	<div className="flex items-center justify-between">
		<div className="flex items-center gap-2">
			<div className={`w-10 h-10 rounded-full ${avatarClass}`} />
			<div>
				<p className="text-sm font-bold text-slate-900 dark:text-white">
					{name}
				</p>
				<p className="text-xs text-slate-500">{handle}</p>
			</div>
		</div>
		<button className="text-xs font-bold text-primary hover:underline">
			Follow
		</button>
	</div>
);

export default RightSidebar;
