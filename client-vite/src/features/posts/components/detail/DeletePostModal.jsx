import React from "react";
import { ConfirmModal } from "../../../../shared/components/ui";

const DeletePostModal = ({ isOpen, onClose, onConfirm }) => {
	return (
		<ConfirmModal
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={onConfirm}
			title="Delete Post"
			message="Are you sure you want to delete this post? This action cannot be undone."
		/>
	);
};

export default DeletePostModal;
