import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useUserProfile } from "../../auth/hooks/useUserQueries";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useUser } from "../../../shared/hooks/useUser";
import { Spinner } from "../../../shared/components/ui";
import ProfileHeader from "./detail/ProfileHeader";
import ProfileBio from "./detail/ProfileBio";
import ProfileTabs from "./detail/ProfileTabs";
import ProfileContent from "./detail/ProfileContent";
import ProfileModals from "./ProfileModals";
import { useProfileActions } from "../hooks/useProfileActions";

const ProfileDetail = () => {
	const { userId } = useParams();
	const { user: currentUser } = useUser();
	const { onlineUsers } = useSocket();
	const {
		data: profileData,
		isLoading: profileLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useUserProfile(userId);

	const user = profileData?.pages?.[0]?.data;

	const {
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
	} = useProfileActions(userId, user, currentUser);

	const { ref, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

	if (!profileData || !profileData.pages[0]) {
		return (
			<div className="text-center py-20">
				<h3 className="text-xl font-bold text-slate-900 dark:text-white">
					User not found
				</h3>
			</div>
		);
	}

	const userPosts = profileData.pages.flatMap((page) => page.data.posts) || [];

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
			<ProfileModals
				user={user}
				currentUser={currentUser}
				isFollowsModalOpen={isFollowsModalOpen}
				setIsFollowsModalOpen={setIsFollowsModalOpen}
				modalType={modalType}
				isUploadModalOpen={isUploadModalOpen}
				setIsUploadModalOpen={setIsUploadModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				deleteImage={deleteImage}
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
					userPostsCount={userPosts?.length || 0}
					followersCount={user.followers?.length || 0}
					followingCount={user.following?.length || 0}
					handleFollowsClick={handleFollowsClick}
				/>
				<ProfileContent
					activeTab={activeTab}
					userPosts={userPosts}
					isCurrentUser={isCurrentUser}
					scrollRef={ref}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
				/>
			</div>
		</div>
	);
};

export default ProfileDetail;
