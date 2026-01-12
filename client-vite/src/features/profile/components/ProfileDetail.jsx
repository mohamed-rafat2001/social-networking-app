import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	useUserProfile,
	useDeleteProfileImage,
} from "../../auth/hooks/useUserQueries";
import {
	useFollowUser,
	useUnfollowUser,
	useBlockUser,
	useUnblockUser,
	useBlockedUsers,
} from "../../auth/hooks/useSocialQueries";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";
import { useCreateChat } from "../../chat/hooks/useChatQueries";
import { Spinner, ConfirmModal } from "../../../shared/components/ui";
import FollowsModal from "./FollowsModal";
import ImageUploadModal from "./ImageUploadModal";
import ProfileHeader from "./detail/ProfileHeader";
import ProfileBio from "./detail/ProfileBio";
import ProfileTabs from "./detail/ProfileTabs";
import ProfileContent from "./detail/ProfileContent";

const ProfileDetail = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useUser();
	const { onlineUsers } = useSocket();
	const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
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

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [userId]);

	const isCurrentUser =
		currentUser?._id === userId || !userId || userId === "user";

	if (profileLoading) {
		return (
			<div className="flex items-center justify-center h-[calc(100vh-100px)]">
				<Spinner size="lg" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="text-center py-20">
				<h3 className="text-xl font-bold text-slate-900 dark:text-white">
					User not found
				</h3>
			</div>
		);
	}

	const user = profile.data;
	const isFollowing = user.followers?.some(
		(f) => String(f._id || f) === String(currentUser?._id)
	);

	const isBlocked = blockedUsersResponse?.data?.some(
		(u) => String(u._id || u) === String(user._id)
	);

	const userPosts = user.posts || [];

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

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
			<FollowsModal
				isOpen={isFollowsModalOpen}
				onClose={() => setIsFollowsModalOpen(false)}
				title={modalType === "followers" ? "Followers" : "Following"}
				users={modalType === "followers" ? user.followers : user.following}
				currentUser={currentUser}
			/>
			<ImageUploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				user={user}
			/>

			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={() => {
					deleteImage();
					setIsDeleteModalOpen(false);
				}}
				title="Delete Profile Photo"
				message="Are you sure you want to remove your profile photo? This action cannot be undone."
				confirmText="Remove Photo"
				variant="danger"
			/>

			<div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm mb-6 transition-colors duration-300">
				<ProfileHeader
					user={user}
					isCurrentUser={isCurrentUser}
					isFollowing={isFollowing}
					onlineUsers={onlineUsers}
					isCreatingChat={isCreatingChat}
					isBlocked={isBlocked}
					handleMessage={handleMessage}
					handleFollowToggle={handleFollowToggle}
					handleBlockToggle={handleBlockToggle}
					setIsUploadModalOpen={setIsUploadModalOpen}
					setIsDeleteModalOpen={setIsDeleteModalOpen}
				/>
				<ProfileBio user={user} />
			</div>

			<div className="space-y-6">
				<ProfileTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					userPostsCount={userPosts.length}
					followersCount={user.followers?.length || 0}
					followingCount={user.following?.length || 0}
					handleFollowsClick={handleFollowsClick}
				/>
				<ProfileContent
					activeTab={activeTab}
					userPosts={userPosts}
					isCurrentUser={isCurrentUser}
				/>
			</div>
		</div>
	);
};

export default ProfileDetail;
