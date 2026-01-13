import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../shared/components/ui";

const FeedTabs = ({ feedType, setFeedType }) => {
	return (
		<div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
			<div className="flex">
				{["for-you", "following"].map((type) => (
					<button
						key={type}
						onClick={() => setFeedType(type)}
						className="flex-1 py-4 px-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group"
					>
						<span
							className={cn(
								"text-[15px] font-bold transition-colors",
								feedType === type
									? "text-slate-900 dark:text-white"
									: "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400"
							)}
						>
							{type === "for-you" ? "For You" : "Following"}
						</span>
						{feedType === type && (
							<motion.div
								layoutId="activeTab"
								className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
							/>
						)}
					</button>
				))}
			</div>
		</div>
	);
};

export default FeedTabs;
