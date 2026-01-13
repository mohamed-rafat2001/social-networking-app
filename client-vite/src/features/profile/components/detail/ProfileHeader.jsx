import React from "react";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileInfo";

const ProfileHeader = ({
	user,
	isCurrentUser,
	isFollowing,
	isBlocked,
	onlineUsers,
	isCreatingChat,
	handleMessage,
	handleFollowToggle,
	handleBlockToggle,
	setIsUploadModalOpen,
	setIsDeleteModalOpen,
}) => {
	return (
		<>
			<ProfileBanner />
			<div className="px-6 md:px-8 pb-8">
				<div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 mb-8 gap-6">
					<ProfileAvatar
						user={user}
						isCurrentUser={isCurrentUser}
						onlineUsers={onlineUsers}
						setIsUploadModalOpen={setIsUploadModalOpen}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
					/>

					<div className="flex flex-col md:flex-row items-center gap-6">
						<ProfileActions
							isCurrentUser={isCurrentUser}
							isFollowing={isFollowing}
							isBlocked={isBlocked}
							isCreatingChat={isCreatingChat}
							handleMessage={handleMessage}
							handleFollowToggle={handleFollowToggle}
							handleBlockToggle={handleBlockToggle}
						/>
					</div>
				</div>
				<ProfileInfo user={user} />
			</div>
		</>
	);
};

export default ProfileHeader;
