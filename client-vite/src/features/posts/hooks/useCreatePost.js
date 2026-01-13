import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useAddPost } from "./usePostQueries";

const postSchema = z.object({
	text: z.string().max(2000, "Post cannot exceed 2000 characters"),
});

export function useCreatePost() {
	const [files, setFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
	const fileInputRef = useRef(null);

	const { mutate: addPostMutation } = useAddPost();

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm({
		resolver: zodResolver(postSchema),
		defaultValues: {
			text: "",
		},
		mode: "onChange",
	});

	const text = watch("text");

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		if (selectedFiles.length === 0) return;

		setFiles((prev) => [...prev, ...selectedFiles]);

		const newPreviewUrls = selectedFiles.map((file) =>
			URL.createObjectURL(file)
		);
		setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

		// Reset the input value so the same file can be selected again if needed
		e.target.value = "";
	};

	const removeFile = (index) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setPreviewUrls((prev) => {
			URL.revokeObjectURL(prev[index]);
			return prev.filter((_, i) => i !== index);
		});
	};

	const onSubmit = (data) => {
		if (!data.text.trim() && files.length === 0) return;

		setIsUploading(true);
		setUploadProgress(0);

		let postData;
		if (files.length === 0) {
			postData = { text: data.text };
		} else {
			const formData = new FormData();
			files.forEach((f) => {
				formData.append("fileUp", f);
			});
			if (data.text) formData.append("text", data.text);
			postData = formData;
		}

		addPostMutation(
			{
				postData,
				onUploadProgress: (progress) => setUploadProgress(progress),
			},
			{
				onSuccess: () => {
					toast.success("Post created successfully!");
					reset();
					setFiles([]);
					setPreviewUrls([]);
					setIsUploading(false);
					setUploadProgress(0);
					if (fileInputRef.current) fileInputRef.current.value = "";
				},
				onError: (error) => {
					console.error("Post creation error:", error);
					const message =
						error.response?.data?.message ||
						error.message ||
						"Failed to create post";
					toast.error(message);
					setIsUploading(false);
					setUploadProgress(0);
				},
			}
		);
	};

	return {
		control,
		handleSubmit,
		text,
		files,
		previewUrls,
		isUploading,
		uploadProgress,
		fileInputRef,
		handleFileChange,
		removeFile,
		onSubmit,
		isPreviewModalOpen,
		setIsPreviewModalOpen,
		selectedPreviewIndex,
		setSelectedPreviewIndex,
		errors,
		isValid,
	};
}
