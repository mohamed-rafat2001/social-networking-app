import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInView } from "react-intersection-observer";
import { toast } from "react-hot-toast";
import { useUser } from "../../../shared/hooks/useUser.js";
import { useTheme } from "../../../providers/ThemeProvider";
import { usePosts, useAddPost } from "../hooks/usePostQueries.js";
import { useSocket } from "../../../shared/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import {
	Avatar,
	Button,
	Spinner,
	cn,
	ImageModal,
	Textarea,
} from "../../../shared/components/ui";

import { HiPhotograph, HiX, HiArrowUp } from "react-icons/hi";

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
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [hasNewContent, setHasNewContent] = useState(false);
	const lastPostIdRef = useRef(null);
	const fileInputRef = useRef(null);

	const { user } = useUser();
	const { darkMode } = useTheme();
	useSocket();

	const {
		data: postsData,
		isLoading: isPostsLoading,
		error: postsError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = usePosts(feedType);

	const posts = postsData?.pages.flatMap((page) => page.data) || [];

	// Track scroll position for "Back to Top" button
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 500) {
				setShowScrollTop(true);
			} else {
				setShowScrollTop(false);
				setHasNewContent(false); // Reset when user reaches top
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Detect new posts at the top
	useEffect(() => {
		if (posts.length > 0) {
			const newestPostId = posts[0]._id;
			if (lastPostIdRef.current && lastPostIdRef.current !== newestPostId) {
				if (window.scrollY > 300) {
					setHasNewContent(true);
				}
			}
			lastPostIdRef.current = newestPostId;
		}
	}, [posts]);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		setHasNewContent(false);
	};

	const { ref, inView } = useInView({
		threshold: 0,
		rootMargin: "100px",
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (postsError) {
		console.error(`PostList [${feedType}] fetch error:`, postsError);
	}

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
							className="flex-1 py-4 px-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative group"
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
									className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
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
							<div className="post-input-container relative z-20">
								<Controller
									name="text"
									control={control}
									render={({ field }) => (
										<Textarea
											{...field}
											placeholder="What's happening in engineering?"
											className="border-none bg-transparent dark:bg-transparent p-0 text-xl focus-visible:ring-0 min-h-[50px] shadow-none"
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
											"grid gap-2 mt-4 rounded-2xl overflow-hidden relative z-30",
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
													className="absolute top-2 right-2 z-40 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
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
						<>
							{posts.map((post) => (
								<PostItem key={post._id} post={post} />
							))}
							{/* Infinite Scroll Trigger */}
							<div ref={ref} className="py-8 flex justify-center items-center">
								{isFetchingNextPage ? (
									<div className="flex flex-col items-center gap-2">
										<div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
										<span className="text-xs font-medium text-slate-400">
											Loading more posts...
										</span>
									</div>
								) : hasNextPage ? (
									<div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
								) : (
									<div className="py-4 text-center">
										<p className="text-sm font-medium text-slate-400">
											No more posts to show
										</p>
									</div>
								)}
							</div>
						</>
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

			{/* Scroll to Top / New Posts Button */}
			<AnimatePresence>
				{showScrollTop && (
					<motion.button
						initial={{ opacity: 0, y: 20, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.8 }}
						onClick={scrollToTop}
						className={cn(
							"fixed bottom-20 right-6 z-50 flex items-center gap-2 p-3 rounded-full shadow-2xl transition-all duration-300 group",
							hasNewContent
								? "bg-primary text-white px-5"
								: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
						)}
					>
						{hasNewContent && (
							<span className="text-sm font-bold whitespace-nowrap">
								New Posts
							</span>
						)}
						<HiArrowUp
							className={cn(
								"w-5 h-5 transition-transform group-hover:-translate-y-0.5",
								hasNewContent ? "animate-bounce" : ""
							)}
						/>
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}

export default PostList;
