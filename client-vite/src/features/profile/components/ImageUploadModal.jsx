import React from "react";
import { Modal } from "../../../shared/components/ui";
import { useTheme } from "../../../providers/ThemeProvider";
import { useImageUpload } from "../../hooks/useImageUpload";
import UploadUserInfo from "./image-upload/UploadUserInfo";
import BioInput from "./image-upload/BioInput";
import UploadArea from "./image-upload/UploadArea";
import UploadActions from "./image-upload/UploadActions";

const ImageUploadModal = ({ isOpen, onClose, user }) => {
	const { darkMode } = useTheme();
	const {
		selectedFile,
		previewUrl,
		setPreviewUrl,
		setSelectedFile,
		uploadProgress,
		isDragging,
		postText,
		setPostText,
		fileInputRef,
		isLoading,
		handleFileSelect,
		onDragOver,
		onDragLeave,
		onDrop,
		handleUpload,
		handleCancel,
	} = useImageUpload(onClose);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="Update Profile"
			size="lg"
		>
			<div className="space-y-4">
				<UploadUserInfo user={user} />

				<BioInput
					value={postText}
					onChange={setPostText}
					darkMode={darkMode}
				/>

				<UploadArea
					previewUrl={previewUrl}
					isDragging={isDragging}
					isLoading={isLoading}
					uploadProgress={uploadProgress}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					onClick={() => fileInputRef.current?.click()}
					onRemove={(e) => {
						e.stopPropagation();
						setSelectedFile(null);
						setPreviewUrl(null);
					}}
				/>

				<UploadActions
					onCancel={handleCancel}
					onUpload={handleUpload}
					isLoading={isLoading}
					hasFile={!!selectedFile}
				/>

				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileSelect}
					accept="image/*"
					className="hidden"
				/>
			</div>
		</Modal>
	);
};

export default ImageUploadModal;
