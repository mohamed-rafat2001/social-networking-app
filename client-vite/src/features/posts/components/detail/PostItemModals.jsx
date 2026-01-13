import React from "react";
import DeletePostModal from "./DeletePostModal";
import EditPostModal from "./EditPostModal";
import RepostModal from "./RepostModal";

const PostItemModals = ({
	post,
	user,
	darkMode,
	isEditModalOpen,
	setIsEditModalOpen,
	isDeleteModalOpen,
	setIsDeleteModalOpen,
	isRepostModalOpen,
	setIsRepostModalOpen,
	editContent,
	setEditContent,
	repostNote,
	setRepostNote,
	handleUpdate,
	handleDelete,
	handleRepostWithNote,
	closeRepostModal,
}) => {
	return (
		<>
			<DeletePostModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
			/>

			<EditPostModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				content={editContent}
				onContentChange={setEditContent}
				onSave={handleUpdate}
			/>

			<RepostModal
				isOpen={isRepostModalOpen}
				onClose={closeRepostModal}
				post={post}
				user={user}
				darkMode={darkMode}
				repostNote={repostNote}
				onRepostNoteChange={setRepostNote}
				onConfirm={handleRepostWithNote}
			/>
		</>
	);
};

export default PostItemModals;
