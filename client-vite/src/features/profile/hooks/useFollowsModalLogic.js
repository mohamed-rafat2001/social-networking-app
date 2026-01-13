import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFollowUser, useUnfollowUser } from "../../auth/hooks/useSocialQueries";

export const useFollowsModalLogic = (users, currentUser, onClose) => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();
	const { mutate: followUser } = useFollowUser();
	const { mutate: unfollowUser } = useUnfollowUser();

	const isFollowing = (userId) => {
		return currentUser?.following?.some(
			(u) => String(u._id || u) === String(userId)
		);
	};

	const filteredUsers = users.filter((user) => {
		const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
		const username = user.username?.toLowerCase() || "";
		const search = searchTerm.toLowerCase();
		return fullName.includes(search) || username.includes(search);
	});

	const handleUserClick = (userId) => {
		navigate(`/profile/${userId}`);
		onClose();
	};

	const handleFollowToggle = (userId) => {
		if (isFollowing(userId)) {
			unfollowUser(userId);
		} else {
			followUser(userId);
		}
	};

	return {
		searchTerm,
		setSearchTerm,
		filteredUsers,
		isFollowing,
		handleUserClick,
		handleFollowToggle,
	};
};
