import React from "react";
import FollowsModal from "./FollowsModal";
import ImageUploadModal from "./ImageUploadModal";
import { ConfirmModal } from "../../../shared/components/ui";

function ProfileModals({
	user,
	currentUser,
	isFollowsModalOpen,
	setIsFollowsModalOpen,
	modalType,
	isUploadModalOpen,
	setIsUploadModalOpen,
	isDeleteModalOpen,
	setIsDeleteModalOpen,
	deleteImage,
}) {
	return (
		<>
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
		</>
	);
}

export default ProfileModals;
