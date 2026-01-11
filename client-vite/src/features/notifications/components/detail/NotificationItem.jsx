import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../../../../shared/components/ui";
import {
	HiOutlineBell,
	HiOutlineChatAlt2,
	HiOutlineUserAdd,
	HiOutlineThumbUp,
	HiOutlineShare,
	HiOutlineAtSymbol,
} from "react-icons/hi";

const NotificationItem = ({
	notification,
	markAsRead,
	onlineUsers,
	onClose,
}) => {
	const navigate = useNavigate();
	const getIcon = (type) => {
		switch (type) {
			case "like":
				return <HiOutlineThumbUp className="text-blue-500" />;
			case "comment":
				return <HiOutlineChatAlt2 className="text-purple-500" />;
			case "follow":
				return <HiOutlineUserAdd className="text-green-500" />;
			case "share":
				return <HiOutlineShare className="text-pink-500" />;
			case "mention":
				return <HiOutlineAtSymbol className="text-yellow-500" />;
			case "message":
				return <HiOutlineChatAlt2 className="text-blue-500" />;
			default:
				return <HiOutlineBell className="text-gray-500" />;
		}
	};

	const handleClick = () => {
		// Mark as read
		if (!notification.read) {
			markAsRead(notification._id);
		}

		// Close dropdown if onClose prop is provided
		if (onClose) onClose();

		// Navigate based on type
		if (notification.type === "follow") {
			navigate(`/profile/${notification.sender._id}`);
		} else if (notification.type === "message") {
			navigate(`/messages`);
		} else if (notification.post) {
			const postId = notification.post._id || notification.post;
			navigate(`/posts/${postId}`);
		} else {
			navigate(`/profile/${notification.sender._id}`);
		}
	};

	return (
		<div
			onClick={handleClick}
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
					<span className="font-bold">
						{notification.sender.firstName} {notification.sender.lastName}
					</span>{" "}
					<span className="text-gray-600 dark:text-gray-400">
						{notification.type === "like" && "liked your post"}
						{notification.type === "comment" && "commented on your post"}
						{notification.type === "follow" && "started following you"}
						{notification.type === "mention" && "mentioned you in a post"}
						{notification.type === "share" && "shared your post"}
						{notification.type === "message" && "sent you a message"}
					</span>
				</p>

				{notification.content && (
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 italic">
						"{notification.content}"
					</p>
				)}

				<p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
					{notification.createdAt &&
					!isNaN(new Date(notification.createdAt).getTime())
						? formatDistanceToNow(new Date(notification.createdAt), {
								addSuffix: true,
						  })
						: "just now"}
				</p>
			</div>

			{!notification.read && (
				<div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
			)}
		</div>
	);
};

export default NotificationItem;
