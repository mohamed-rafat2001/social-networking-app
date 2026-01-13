import React from "react";

const ChatListSkeleton = () => {
	return (
		<div className="p-4 space-y-4">
			<div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div key={i} className="flex gap-3 animate-pulse">
					<div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
					<div className="flex-1 space-y-2 py-1">
						<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
						<div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatListSkeleton;
