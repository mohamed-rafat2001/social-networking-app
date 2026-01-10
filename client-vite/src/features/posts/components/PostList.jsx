import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "../../../shared/hooks/useUser.js";
import { useTheme } from "../../../providers/ThemeProvider";
import {
	usePosts,
	useAddPost,
	useLikePost,
	useSharePost,
} from "../hooks/usePostQueries.js";
import { useSocket } from "../../../shared/hooks/useSocket";
import InputEmoji from "react-input-emoji";
import { motion, AnimatePresence } from "framer-motion";
import {
	Avatar,
	Button,
	Spinner,
	cn,
	ImageModal,
} from "../../../shared/components/ui";

import {
	HiPhotograph,
	HiFilm,
	HiEmojiHappy,
	HiDotsHorizontal,
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiX,
	HiChartBar,
	HiUpload,
} from "react-icons/hi";

import PostItem from "./PostItem";

function PostList() {
	const [text, setText] = useState("");
	const [files, setFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
	const fileInputRef = useRef(null);

	const { user } = useUser();
	const { darkMode } = useTheme();
	const { onlineUsers } = useSocket();

	const { data: postsData, isLoading: isPostsLoading } = usePosts();
	const { mutate: addPostMutation } = useAddPost();
	const { mutate: likePostMutation } = useLikePost();
	const { mutate: sharePostMutation } = useSharePost();

	const posts = postsData?.data || [];

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

	const likeOn = (id) => {
		likePostMutation(id);
	};
	const addShare = (id) => {
		sharePostMutation(id);
	};

	const handleSubmit = (e) => {
		if (e) e.preventDefault();
		if (!text.trim() && files.length === 0) return;

		setIsUploading(true);
		setUploadProgress(0);

		let postData;
		if (files.length === 0) {
			postData = { text };
		} else {
			const data = new FormData();
			files.forEach((f) => {
				data.append("fileUp", f);
			});
			if (text) data.append("text", text);
			postData = data;
		}

		addPostMutation(
			{
				postData,
				onUploadProgress: (progress) => setUploadProgress(progress),
			},
			{
				onSuccess: () => {
					toast.success("Post created successfully!");
					setText("");
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

	return (
		<div className="w-full">
			{/* Sticky Header */}
			<div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 z-10">
				<div className="flex">
					<button
						type="button"
						className="flex-1 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all border-b-4 border-primary"
					>
						<span className="font-bold text-gray-900 dark:text-white">
							For you
						</span>
					</button>
					<button
						type="button"
						className="flex-1 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all border-b-4 border-transparent"
					>
						<span className="font-bold text-gray-500 dark:text-gray-400">
							Following
						</span>
					</button>
				</div>
			</div>

			{/* Create Post Area */}
			<div className="p-4 border-b dark:border-gray-800">
				<div className="flex gap-4">
					<Avatar src={user?.image?.secure_url} />
					<form className="flex-1" onSubmit={handleSubmit}>
						<div className="mb-2 emoji-input-container">
							<InputEmoji
								value={text}
								onChange={setText}
								cleanOnEnter
								onEnter={handleSubmit}
								placeholder="What's on your mind?"
								fontSize={16}
								fontFamily="inherit"
								borderColor="transparent"
								theme={darkMode ? "dark" : "light"}
								background={darkMode ? "#1f2937" : "#f9fafb"}
								color={darkMode ? "#f3f4f6" : "#1f2937"}
								placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
							/>
						</div>

						{/* Image Previews */}
						{previewUrls.length > 0 && (
							<div
								className={cn(
									"grid gap-2 mb-4",
									previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
								)}
							>
								{previewUrls.slice(0, 4).map((url, index) => (
									<div
										key={url}
										className={cn(
											"relative group rounded-2xl overflow-hidden border dark:border-gray-800 bg-gray-100 dark:bg-gray-800 cursor-pointer",
											previewUrls.length === 1 ? "" : "aspect-square"
										)}
										onClick={() => {
											setSelectedPreviewIndex(index);
											setIsPreviewModalOpen(true);
										}}
									>
										<img
											src={url}
											alt=""
											className={cn(
												"w-full h-full",
												previewUrls.length === 1
													? "object-contain max-h-[512px]"
													: "object-cover"
											)}
										/>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												removeFile(index);
											}}
											className="absolute top-2 right-2 p-1.5 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full backdrop-blur-sm transition-all z-10"
										>
											<HiX className="text-sm" />
										</button>
										{previewUrls.length > 4 && index === 3 && (
											<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">
												<span className="text-white text-2xl font-bold">
													+{previewUrls.length - 4}
												</span>
												<span className="text-white/80 text-xs font-medium uppercase tracking-wider">
													more images
												</span>
											</div>
										)}
									</div>
								))}
							</div>
						)}

						<ImageModal
							isOpen={isPreviewModalOpen}
							onClose={() => setIsPreviewModalOpen(false)}
							images={previewUrls}
							initialIndex={selectedPreviewIndex}
						/>

						<div className="flex justify-between items-center mt-2 pt-2 border-t dark:border-gray-800">
							<div className="flex gap-1">
								<label
									htmlFor="image-upload"
									className="cursor-pointer hover:bg-primary/10 p-2 rounded-full transition-colors text-primary"
									title="Add images"
								>
									<HiPhotograph className="text-xl" />
								</label>
								<input
									ref={fileInputRef}
									type="file"
									id="image-upload"
									className="hidden"
									accept="image/*"
									multiple
									onChange={handleFileChange}
								/>
								<button
									type="button"
									className="hover:bg-primary/10 p-2 rounded-full transition-colors text-primary"
									title="Add video"
								>
									<HiFilm className="text-xl" />
								</button>
								<button
									type="button"
									className="hover:bg-primary/10 p-2 rounded-full transition-colors text-primary"
									title="Add feeling"
								>
									<HiEmojiHappy className="text-xl" />
								</button>
							</div>

							<div className="flex items-center gap-4">
								{isUploading && (
									<div className="flex items-center gap-2">
										<div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
											<motion.div
												className="h-full bg-primary"
												initial={{ width: 0 }}
												animate={{ width: `${uploadProgress}%` }}
											/>
										</div>
										<span className="text-xs font-bold text-gray-500 dark:text-gray-400">
											{uploadProgress}%
										</span>
									</div>
								)}
								<Button
									type="submit"
									className="px-6 py-1.5 rounded-full font-bold relative overflow-hidden"
									disabled={(!text.trim() && files.length === 0) || isUploading}
								>
									<span className={isUploading ? "opacity-0" : "opacity-100"}>
										Post
									</span>
									{isUploading && (
										<div className="absolute inset-0 flex items-center justify-center">
											<Spinner size="sm" variant="white" />
										</div>
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>

			{/* Posts List */}
			<AnimatePresence initial={false}>
				{isPostsLoading ? (
					<div className="flex justify-center items-center p-12">
						<Spinner size="lg" />
					</div>
				) : posts.length > 0 ? (
					posts.map((post, index) => (
						<PostItem key={post._id} post={post} index={index} />
					))
				) : (
					<div className="flex flex-col items-center justify-center p-12 text-center">
						<p className="text-gray-500 dark:text-gray-400 text-lg">
							No posts yet. Be the first to share something!
						</p>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default PostList;
