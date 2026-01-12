import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useUser } from "../../../shared/hooks/useUser.js";
import { useTheme } from "../../../providers/ThemeProvider";
import { usePosts, useAddPost } from "../hooks/usePostQueries.js";
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

import { HiPhotograph, HiFilm, HiEmojiHappy, HiX } from "react-icons/hi";

import PostItem from "./PostItem";

const postSchema = z.object({
	text: z.string().max(2000, "Post cannot exceed 2000 characters"),
});

function PostList() {
	const [files, setFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
	const [feedType, setFeedType] = useState("for-you");
	const fileInputRef = useRef(null);

	const { user } = useUser();
	const { darkMode } = useTheme();
	useSocket();

	const {
		data: postsData,
		isLoading: isPostsLoading,
		error: postsError,
	} = usePosts(feedType);

	if (postsError) {
		console.error(`PostList [${feedType}] fetch error:`, postsError);
	}

	console.log(`PostList [${feedType}]:`, {
		count: postsData?.results,
		hasData: !!postsData?.data,
		dataLength: postsData?.data?.length,
		error: postsError?.message,
	});
	const { mutate: addPostMutation } = useAddPost();

	const {
		control,
		handleSubmit: handleFormSubmit,
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

	return (
		<div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
			{/* Feed Tabs */}
			<div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
				<div className="flex">
					{["for-you", "following"].map((type) => (
						<button
							key={type}
							onClick={() => setFeedType(type)}
							className="flex-1 py-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group"
						>
							<span
								className={cn(
									"text-[15px] font-bold transition-colors",
									feedType === type
										? "text-slate-900 dark:text-white"
										: "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400"
								)}
							>
								{type === "for-you" ? "For You" : "Following"}
							</span>
							{feedType === type && (
								<motion.div
									layoutId="activeTab"
									className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full"
								/>
							)}
						</button>
					))}
				</div>
			</div>

			<div className="p-4 border-b border-slate-200 dark:border-slate-800">
				<form onSubmit={handleFormSubmit(onSubmit)}>
					<div className="flex gap-4">
						<Avatar
							src={user?.image?.secure_url}
							size="md"
							className="shrink-0"
						/>
						<div className="flex-1 min-w-0">
							<div className="post-input-container emoji-input-container relative z-20">
								<style>
									{`
										.post-input-container .react-input-emoji--container {
											background: transparent !important;
											border: none !important;
											margin-bottom: 0 !important;
										}
										.post-input-container .react-input-emoji--wrapper {
											background: transparent !important;
											border: none !important;
											padding: 0 !important;
										}
										.post-input-container .react-input-emoji--input {
											background: transparent !important;
											padding: 12px 0 !important;
											color: ${darkMode ? "white" : "#0f172a"} !important;
											font-size: 19px !important;
											min-height: 50px !important;
										}
										.post-input-container .react-input-emoji--placeholder {
											left: 0 !important;
											font-size: 19px !important;
											color: ${darkMode ? "#64748b" : "#94a3b8"} !important;
										}
										.post-input-container .react-input-emoji--button {
											padding: 8px !important;
										}
									`}
								</style>
								<Controller
									name="text"
									control={control}
									render={({ field }) => (
										<InputEmoji
											value={field.value}
											onChange={field.onChange}
											placeholder="What's happening in engineering?"
											theme={darkMode ? "dark" : "light"}
											fontSize={19}
											fontFamily="inherit"
											borderColor="transparent"
											background="transparent"
										/>
									)}
								/>
							</div>

							{/* Image Previews */}
							<AnimatePresence>
								{previewUrls.length > 0 && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className={cn(
											"grid gap-2 mt-4 rounded-2xl overflow-hidden",
											previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
										)}
									>
										{previewUrls.map((url, index) => (
											<div key={url} className="relative group aspect-video">
												<img
													src={url}
													alt=""
													className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
													onClick={() => {
														setSelectedPreviewIndex(index);
														setIsPreviewModalOpen(true);
													}}
												/>
												<button
													type="button"
													onClick={() => removeFile(index)}
													className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
												>
													<HiX size={18} />
												</button>
											</div>
										))}
									</motion.div>
								)}
							</AnimatePresence>

							<div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
								<div className="flex items-center">
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-all active:scale-95"
										title="Add Media"
									>
										<HiPhotograph size={22} />
									</button>
									<button
										type="button"
										className="p-2.5 text-primary hover:bg-primary/10 rounded-full transition-all active:scale-95"
										title="Add Emoji"
									>
										<HiEmojiHappy size={22} />
									</button>
								</div>

								<div className="flex items-center gap-4">
									{text.length > 0 && (
										<span
											className={cn(
												"text-[13px] font-medium",
												text.length > 1800 ? "text-red-500" : "text-slate-400"
											)}
										>
											{text.length}/2000
										</span>
									)}
									<Button
										type="submit"
										disabled={
											(!text.trim() && files.length === 0) || isUploading
										}
										className="rounded-full px-6 py-2 shadow-lg shadow-primary/20"
									>
										{isUploading ? <Spinner size="sm" /> : "Post"}
									</Button>
								</div>
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
			</div>

			{/* Posts List */}
			<div className="divide-y divide-slate-100 dark:divide-slate-800/50">
				<AnimatePresence initial={false}>
					{isPostsLoading ? (
						<div className="flex justify-center items-center p-12">
							<Spinner size="lg" />
						</div>
					) : posts.length > 0 ? (
						posts.map((post) => <PostItem key={post._id} post={post} />)
					) : (
						<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
							<div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
								<svg
									className="w-8 h-8 text-slate-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
								{feedType === "following"
									? "No posts from people you follow"
									: "No posts yet"}
							</h3>
							<p className="text-slate-500 dark:text-slate-400 max-w-xs">
								{feedType === "following"
									? "When people you follow share posts, they'll show up here."
									: "Be the first one to share something with the world!"}
							</p>
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

export default PostList;
