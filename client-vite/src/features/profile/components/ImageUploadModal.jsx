import React, { useState, useRef, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import { useTheme } from "../../../providers/ThemeProvider";
import {
	Modal,
	Button,
	ProgressBar,
	cn,
	Avatar,
} from "../../../shared/components/ui";
import { HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";
import { useUpdateProfileImage } from "../../auth/hooks/useUserQueries";

const ImageUploadModal = ({ isOpen, onClose, user }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [postText, setPostText] = useState("");
	const fileInputRef = useRef(null);
	const { darkMode } = useTheme();
	const { mutate: updateImage, isPending: isLoading } = useUpdateProfileImage();

	useEffect(() => {
		if (!isOpen) {
			setPostText("");
		}
	}, [isOpen]);

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				alert("Please select an image file");
				return;
			}
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
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
				},
			}
		);
	};

	const handleCancel = () => {
		if (isLoading) return;
		setSelectedFile(null);
		setPreviewUrl(null);
		setUploadProgress(0);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleCancel}
			title="Update Profile"
			size="lg"
		>
			<div className="space-y-4">
				{/* User Info Header - Post Style */}
				<div className="flex items-center gap-3 px-1">
					<Avatar src={user?.image?.secure_url} size="md" />
					<div>
						<h3 className="font-bold text-gray-900 dark:text-white leading-tight">
							{user?.firstName} {user?.lastName}
						</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Updating profile...
						</p>
					</div>
				</div>

				{/* Post Text Input - Post Style with Emoji */}
				<div className="px-1 profile-emoji-input emoji-input-container">
					<style>
						{`
							.profile-emoji-input .react-input-emoji--container {
								background: transparent !important;
								border: none !important;
							}
							.profile-emoji-input .react-input-emoji--wrapper {
								background: transparent !important;
								border: none !important;
							}
							.profile-emoji-input .react-input-emoji--input {
								background: transparent !important;
								padding: 12px 0 !important;
								color: ${darkMode ? "white" : "#1f2937"} !important;
							}
						`}
					</style>
					<InputEmoji
						value={postText}
						onChange={setPostText}
						cleanOnEnter={false}
						placeholder={`Say something about your new profile picture...`}
						theme={darkMode ? "dark" : "light"}
						fontSize={16}
						fontFamily="inherit"
						borderColor="transparent"
						background="transparent"
						placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
						color={darkMode ? "#ffffff" : "#1f2937"}
					/>
				</div>

				{/* Image Preview / Upload Area */}
				<div className="px-1">
					{!previewUrl ? (
						<div
							onClick={() => fileInputRef.current?.click()}
							onDragOver={onDragOver}
							onDragLeave={onDragLeave}
							onDrop={onDrop}
							className={cn(
								"border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group bg-gray-50/50 dark:bg-gray-800/30",
								isDragging
									? "border-primary bg-primary/10 scale-[1.01]"
									: "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5"
							)}
						>
							<div
								className={cn(
									"w-12 h-12 rounded-full flex items-center justify-center transition-colors",
									isDragging
										? "bg-primary text-white"
										: "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary"
								)}
							>
								<HiOutlinePhotograph size={24} />
							</div>
							<div className="text-center">
								<p className="text-sm font-bold text-gray-900 dark:text-white">
									{isDragging ? "Drop photo here" : "Add Profile Photo"}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									or drag and drop
								</p>
							</div>
						</div>
					) : (
						<div className="relative rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-sm">
							<div className="aspect-video bg-gray-100 dark:bg-gray-800">
								<img
									src={previewUrl}
									alt="Preview"
									className={cn(
										"w-full h-full object-cover transition-all duration-500",
										isLoading && "blur-sm scale-105 brightness-75"
									)}
								/>
							</div>

							{isLoading && (
								<div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]">
									<div className="w-full max-w-xs space-y-4">
										<div className="flex justify-between items-end text-white">
											<span className="text-xs font-black uppercase tracking-widest drop-shadow-md">
												Uploading
											</span>
											<span className="text-lg font-black drop-shadow-md">
												{uploadProgress}%
											</span>
										</div>
										<ProgressBar
											progress={uploadProgress}
											className="h-2 shadow-xl ring-1 ring-white/20"
										/>
									</div>
								</div>
							)}

							{!isLoading && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										setSelectedFile(null);
										setPreviewUrl(null);
									}}
									className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white transition-colors backdrop-blur-sm"
								>
									<HiOutlineX size={18} />
								</button>
							)}
						</div>
					)}
				</div>

				{/* Bottom Bar / Actions */}
				<div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
					<div className="flex gap-2">
						<Button
							variant="secondary"
							size="sm"
							className="rounded-xl px-4 font-bold"
							onClick={handleCancel}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							size="sm"
							className="rounded-xl px-6 font-bold shadow-md shadow-primary/20"
							onClick={handleUpload}
							disabled={!selectedFile || isLoading}
						>
							{isLoading ? "Saving..." : "Post Update"}
						</Button>
					</div>
				</div>

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
