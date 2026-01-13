import { useState, useEffect } from "react";
import {
	useFollowUser,
	useUnfollowUser,
	useBlockUser,
	useUnblockUser,
	useBlockedUsers,
} from "../../auth/hooks/useSocialQueries";
import { useDeleteProfileImage } from "../../auth/hooks/useUserQueries";
import { useCreateChat } from "../../chat/hooks/useChatQueries";

export function useProfileActions(userId, user, currentUser) {
	const { mutate: followUser } = useFollowUser();
	const { mutate: unfollowUser } = useUnfollowUser();
	const { mutate: blockUser } = useBlockUser();
	const { mutate: unblockUser } = useUnblockUser();
	const { data: blockedUsersResponse } = useBlockedUsers();
	const { mutate: createChat, isLoading: isCreatingChat } = useCreateChat();
	const { mutate: deleteImage } = useDeleteProfileImage();

	const [activeTab, setActiveTab] = useState("posts");
	const [isFollowsModalOpen, setIsFollowsModalOpen] = useState(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [modalType, setModalType] = useState("followers");

	const isFollowing = user?.followers?.some(
		(f) => String(f._id || f) === String(currentUser?._id)
	);

	const isBlocked = blockedUsersResponse?.data?.some(
		(u) => String(u._id || u) === String(user?._id)
	);

	const handleFollowToggle = () => {
		if (isFollowing) {
			unfollowUser(user._id);
		} else {
			followUser(user._id);
		}
	};

	const handleBlockToggle = () => {
		if (isBlocked) {
			unblockUser(user._id);
		} else {
			blockUser(user._id);
		}
	};

	const handleMessage = () => {
		if (user?._id) {
			createChat(user._id);
		}
	};

	const handleFollowsClick = (type) => {
		setModalType(type);
		setIsFollowsModalOpen(true);
	};

	return {
		activeTab,
		setActiveTab,
		isFollowsModalOpen,
		setIsFollowsModalOpen,
		isUploadModalOpen,
		setIsUploadModalOpen,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		modalType,
		isFollowing,
		isBlocked,
		isCreatingChat,
		handleFollowToggle,
		handleBlockToggle,
		handleMessage,
		handleFollowsClick,
		deleteImage,
	};
}
