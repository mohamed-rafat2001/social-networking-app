import React from "react";
import { ConfirmModal } from "../../../shared/components/ui";
import EditMessageModal from "./detail/EditMessageModal";

const ChatModals = ({
	isDeleteChatModalOpen,
	setIsDeleteChatModalOpen,
	handleDeleteChat,
	messageToDelete,
	setMessageToDelete,
	handleDeleteMessage,
	editingMessage,
	setEditingMessage,
	editContent,
	setEditContent,
	handleUpdateMessage,
}) => {
	return (
		<>
			<ConfirmModal
				isOpen={isDeleteChatModalOpen}
				onClose={() => setIsDeleteChatModalOpen(false)}
				onConfirm={handleDeleteChat}
				title="Delete Chat"
				message="Are you sure you want to delete this entire chat? This action cannot be undone."
			/>

			<ConfirmModal
				isOpen={!!messageToDelete}
				onClose={() => setMessageToDelete(null)}
				onConfirm={handleDeleteMessage}
				title="Delete Message"
				message="Are you sure you want to delete this message? This action cannot be undone."
			/>

			<EditMessageModal
				editingMessage={editingMessage}
				setEditingMessage={setEditingMessage}
				editContent={editContent}
				setEditContent={setEditContent}
				handleUpdateMessage={handleUpdateMessage}
			/>
		</>
	);
};

export default ChatModals;
