import React from "react";
import { useNavigate } from "react-router-dom";
import {
	HiOutlineBell,
	HiOutlineChatAlt2,
	HiOutlineUserAdd,
	HiOutlineThumbUp,
	HiOutlineShare,
	HiOutlineAtSymbol,
} from "react-icons/hi";

export const useNotificationItemLogic = (notification, markAsRead, onClose) => {
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

	const handleClick = (e) => {
		if (!notification.read) {
			markAsRead(notification._id);
		}

		if (onClose) onClose();

		if (notification.type === "follow") {
			navigate(`/profile/${notification.sender._id}`);
		} else if (notification.type === "message") {
			navigate(`/messages`);
		} else if (notification.post) {
			const postId = notification.post._id || notification.post;
			navigate(`/posts/${postId}`);
		} else if (notification.share) {
			const shareId = notification.share._id || notification.share;
			navigate(`/posts/${shareId}`);
		} else if (notification.comment) {
			const postId = notification.comment.postId || notification.comment.post;
			if (postId) {
				navigate(`/posts/${postId}`);
			} else {
				navigate(`/profile/${notification.sender._id}`);
			}
		} else {
			navigate(`/profile/${notification.sender._id}`);
		}
	};

	const handleProfileClick = (e) => {
		e.stopPropagation();
		if (onClose) onClose();
		navigate(`/profile/${notification.sender._id}`);
	};

	const getNotificationText = () => {
		const { type, comment } = notification;
		if (type === "like") return comment ? "liked your comment" : "liked your post";
		if (type === "comment") return comment ? "replied to your comment" : "commented on your post";
		if (type === "follow") return "started following you";
		if (type === "mention") return "mentioned you in a post";
		if (type === "share") return "shared your post";
		if (type === "message") return "sent you a message";
		return "";
	};

	return {
		getIcon,
		handleClick,
		handleProfileClick,
		getNotificationText,
	};
};
