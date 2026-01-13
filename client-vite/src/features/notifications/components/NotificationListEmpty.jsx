import React from "react";
import { HiOutlineBell } from "react-icons/hi";

const NotificationListEmpty = ({ filterType }) => {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center px-4">
			<div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
				<HiOutlineBell size={40} />
			</div>
			<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
				No {filterType === "messages" ? "messages" : "notifications"} yet
			</h3>
			<p className="text-gray-500 dark:text-gray-400 max-w-xs">
				{filterType === "messages"
					? "When you receive new messages, they'll show up here."
					: "When you get likes, comments, or new followers, they'll show up here."}
			</p>
		</div>
	);
};

export default NotificationListEmpty;
