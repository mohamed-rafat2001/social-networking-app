import React from "react";

const NotificationListSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 p-4">
			{[1, 2, 3, 4, 5].map((i) => (
				<div key={i} className="flex gap-4 animate-pulse">
					<div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
					<div className="flex-1 space-y-2 py-1">
						<div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
						<div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotificationListSkeleton;
