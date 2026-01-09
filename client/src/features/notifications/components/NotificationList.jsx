import { useNotifications } from "../hooks/useNotifications";
import { Avatar } from "../../../shared/components/UI";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useSocket } from "../../../providers/SocketProvider";
import {
	HiOutlineBell,
	HiOutlineChatAlt2,
	HiOutlineUserAdd,
	HiOutlineThumbUp,
} from "react-icons/hi";

const NotificationList = () => {
	const { notifications, isLoading, markAsRead } = useNotifications();
	const { onlineUsers } = useSocket();

	const getIcon = (type) => {
		switch (type) {
			case "like":
				return <HiOutlineThumbUp className="text-blue-500" />;
			case "comment":
				return <HiOutlineChatAlt2 className="text-purple-500" />;
			case "follow":
				return <HiOutlineUserAdd className="text-green-500" />;
			default:
				return <HiOutlineBell className="text-gray-500" />;
		}
	};

	if (isLoading) {
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
	}

	if (!notifications?.length) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center px-4">
				<div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
					<HiOutlineBell size={40} />
				</div>
				<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
					No notifications yet
				</h3>
				<p className="text-gray-500 dark:text-gray-400 max-w-xs">
					When you get likes, comments, or new followers, they'll show up here.
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-gray-100 dark:divide-gray-800">
			{notifications.map((notification) => (
				<div
					key={notification._id}
					onClick={() => !notification.read && markAsRead(notification._id)}
					className={`flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
						!notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
					}`}
				>
					<div className="relative">
						<Avatar
							src={notification.sender.image?.secure_url}
							size="md"
							isActive={onlineUsers?.some(
								(u) => String(u.userId) === String(notification.sender._id)
							)}
						/>
						<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
							{getIcon(notification.type)}
						</div>
					</div>

					<div className="flex-1 min-w-0">
						<p className="text-sm text-gray-900 dark:text-white leading-snug">
							<Link
								to={`/profile/${notification.sender._id}`}
								className="font-bold hover:underline"
								onClick={(e) => e.stopPropagation()}
							>
								{notification.sender.firstName} {notification.sender.lastName}
							</Link>{" "}
							<span className="text-gray-600 dark:text-gray-400">
								{notification.type === "like" && "liked your post"}
								{notification.type === "comment" && "commented on your post"}
								{notification.type === "follow" && "started following you"}
								{notification.type === "mention" && "mentioned you in a post"}
							</span>
						</p>

						{notification.content && (
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 italic">
								"{notification.content}"
							</p>
						)}

						<p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
							{formatDistanceToNow(new Date(notification.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>

					{!notification.read && (
						<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
					)}
				</div>
			))}
		</div>
	);
};

export default NotificationList;
