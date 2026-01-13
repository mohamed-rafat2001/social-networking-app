import { useState, useRef, useEffect } from "react";
import { useUpdateProfileImage } from "../../auth/hooks/useUserQueries";

export const useImageUpload = (onClose) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [postText, setPostText] = useState("");
	const fileInputRef = useRef(null);
	const { mutate: updateImage, isPending: isLoading } = useUpdateProfileImage();

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				alert("Please select an image file");
				return;
			}
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			setUploadProgress(0);
		}
	};

	const onDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const onDragLeave = (e) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const onDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		handleFileSelect(e);
	};

	const handleUpload = () => {
		const formData = new FormData();
		if (selectedFile) {
			formData.append("avatar", selectedFile);
		}
		const textToSubmit = typeof postText === "string" ? postText : "";
		formData.append("bio", textToSubmit);

		updateImage(
			{
				formData,
				onProgress: (progress) => setUploadProgress(progress),
			},
			{
				onSuccess: () => {
					onClose();
					setSelectedFile(null);
					setPreviewUrl(null);
					setUploadProgress(0);
					setPostText("");
				},
			}
		);
	};

	const handleCancel = () => {
		if (isLoading) return;
		setSelectedFile(null);
		setPreviewUrl(null);
		setUploadProgress(0);
		setPostText("");
		onClose();
	};

	return {
		selectedFile,
		setSelectedFile,
		previewUrl,
		setPreviewUrl,
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
	};
};
