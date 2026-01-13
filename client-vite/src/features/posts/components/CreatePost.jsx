import React from "react";
import { Controller } from "react-hook-form";
import InputEmoji from "react-input-emoji";
import { Avatar, ImageModal } from "../../../shared/components/ui";
import { useCreatePost } from "../hooks/useCreatePost";
import { PostImagePreviews } from "./create-post/PostImagePreviews";
import { PostActions } from "./create-post/PostActions";
import { useTheme } from "../../../providers/ThemeProvider";

const CreatePost = ({ user }) => {
	const { darkMode } = useTheme();
	const {
		control,
		handleSubmit,
		text,
		files,
		previewUrls,
		isUploading,
		fileInputRef,
		handleFileChange,
		removeFile,
		onSubmit,
		isPreviewModalOpen,
		setIsPreviewModalOpen,
		selectedPreviewIndex,
		setSelectedPreviewIndex,
	} = useCreatePost();

	return (
		<div className="p-4 border-b border-slate-200 dark:border-slate-800">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex gap-4">
					<Avatar
						src={user?.image?.secure_url}
						size="md"
						className="shrink-0"
					/>
					<div className="flex-1 min-w-0 relative">
						<div className="post-content-wrapper relative">
							<div className="post-input-container z-10">
								<style>
									{`
										.post-input-container .react-input-emoji--container {
											margin: 0 !important;
											border: none !important;
											background: transparent !important;
										}
										.post-input-container .react-input-emoji--wrapper {
											background: transparent !important;
											border: none !important;
											padding: 0 !important;
										}
										.post-input-container .react-input-emoji--input {
											padding: 8px 0 40px 0 !important;
											min-height: 80px !important;
											font-size: 20px !important;
											color: ${darkMode ? "#f8fafc" : "#0f172a"} !important;
										}
										.post-input-container .react-input-emoji--placeholder {
											left: 0 !important;
											padding: 8px 0 !important;
											font-size: 20px !important;
										}
										.post-input-container .react-input-emoji--button {
											position: absolute !important;
											bottom: 8px !important;
											left: 0 !important;
											color: #3b82f6 !important;
											padding: 8px !important;
											transition: all 0.2s !important;
											border-radius: 9999px !important;
											z-index: 60 !important;
										}
										.post-input-container .react-input-emoji--button:hover {
											background-color: rgba(59, 130, 246, 0.1) !important;
										}
										.post-input-container .react-input-emoji--picker-wrapper {
											z-index: 1000 !important;
											position: absolute !important;
											bottom: 50px !important;
											left: 0 !important;
										}
									`}
								</style>
								<Controller
									name="text"
									control={control}
									render={({ field: { value, onChange } }) => (
										<InputEmoji
											value={value}
											onChange={onChange}
											placeholder="What's happening in engineering?"
											theme={darkMode ? "dark" : "light"}
											cleanOnEnter={false}
											fontSize={20}
											fontFamily="inherit"
											background="transparent"
											borderColor="transparent"
											color={darkMode ? "#f8fafc" : "#0f172a"}
											placeholderColor={darkMode ? "#475569" : "#94a3b8"}
										/>
									)}
								/>
							</div>

							{/* Image Previews */}
							<PostImagePreviews
								previewUrls={previewUrls}
								removeFile={removeFile}
								setSelectedPreviewIndex={setSelectedPreviewIndex}
								setIsPreviewModalOpen={setIsPreviewModalOpen}
							/>

							<PostActions
								fileInputRef={fileInputRef}
								text={text}
								files={files}
								isUploading={isUploading}
							/>
						</div>
					</div>
				</div>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					multiple
					accept="image/*"
					className="hidden"
				/>
			</form>

			<ImageModal
				isOpen={isPreviewModalOpen}
				onClose={() => setIsPreviewModalOpen(false)}
				images={previewUrls}
				initialIndex={selectedPreviewIndex}
			/>
		</div>
	);
};

export default CreatePost;
