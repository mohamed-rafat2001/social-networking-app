import { useState, useRef } from "react";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useUser } from "../../../hooks/useUser.js";
import {
	usePosts,
	useAddPost,
	useLikePost,
	useSharePost,
} from "../hooks/usePostQueries.js";
import { useSocket } from "../../../providers/SocketProvider";
import InputEmoji from "react-input-emoji";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, Spinner } from "../../../ui";

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

function PostList() {
	const [text, setText] = useState("");
	const [files, setFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const { user } = useUser();
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
				data.append("filess", f);
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
						<div className="mb-2">
							<InputEmoji
								value={text}
								onChange={setText}
								cleanOnEnter
								onEnter={handleSubmit}
								placeholder="What's on your mind?"
								fontSize={16}
								fontFamily="inherit"
								borderColor="transparent"
								theme={
									document.documentElement.classList.contains("dark")
										? "dark"
										: "light"
								}
							/>
						</div>

						{/* Image Previews */}
						{previewUrls.length > 0 && (
							<div
								className={`grid gap-2 mb-4 ${
									previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
								}`}
							>
								{previewUrls.map((url, index) => (
									<div
										key={url}
										className={`relative group rounded-2xl overflow-hidden border dark:border-gray-800 bg-gray-100 dark:bg-gray-800 ${
											previewUrls.length === 1 ? "" : "aspect-square"
										}`}
									>
										<img
											src={url}
											alt=""
											className={`w-full h-full ${
												previewUrls.length === 1
													? "object-contain max-h-[512px]"
													: "object-cover"
											}`}
										/>
										<button
											type="button"
											onClick={() => removeFile(index)}
											className="absolute top-2 right-2 p-1.5 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full backdrop-blur-sm transition-all"
										>
											<HiX className="text-sm" />
										</button>
									</div>
								))}
							</div>
						)}

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
						<motion.div
							key={post._id}
							className="border-b dark:border-gray-800 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-all"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
							layout
						>
							<div className="flex gap-3">
								<Avatar src={post.userId?.image?.secure_url} />
								<div className="flex-1">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-1 flex-wrap">
											<span className="font-bold text-black dark:text-white hover:underline flex items-center gap-2">
												{post.userId?.firstName} {post.userId?.lastName}
											</span>
											<span className="text-gray-500 dark:text-gray-400">
												@{post.userId?.firstName?.toLowerCase()}
											</span>
											<span className="text-gray-500 dark:text-gray-400">
												·
											</span>
											<span className="text-gray-500 dark:text-gray-400 text-sm">
												{moment(post.createdAt).fromNow(true)}
											</span>
										</div>
										<button className="text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors">
											<HiDotsHorizontal />
										</button>
									</div>

									<p className="mt-1 mb-3 text-black dark:text-gray-200 leading-normal break-words">
										{post.text}
									</p>

									{post.fileUp?.[0] && (
										<motion.div
											className="rounded-2xl overflow-hidden border dark:border-gray-800 mb-3 bg-gray-50 dark:bg-gray-800/50"
											initial={{ opacity: 0, scale: 0.98 }}
											animate={{ opacity: 1, scale: 1 }}
										>
											<img
												className="w-full h-auto max-h-[600px] object-contain block mx-auto"
												src={post.fileUp[0].secure_url}
												alt="Post content"
											/>
										</motion.div>
									)}

									<div className="flex justify-between text-gray-500 dark:text-gray-400 max-w-md mt-2">
										<motion.button
											className="flex items-center gap-2 hover:text-primary group transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
												<HiChatAlt2 />
											</div>
											<span className="text-sm">0</span>
										</motion.button>
										<motion.button
											className={`flex items-center gap-2 hover:text-green-500 group transition-colors ${
												post.shares.some(
													(e) => e.userId === user?._id?.toString()
												)
													? "text-green-500"
													: ""
											}`}
											onClick={(e) => {
												e.stopPropagation();
												addShare(post._id);
											}}
											whileHover={{ scale: 1.05 }}
										>
											<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
												<HiRefresh />
											</div>
											<span className="text-sm">{post.shares.length}</span>
										</motion.button>
										<motion.button
											className={`flex items-center gap-2 hover:text-pink-500 group transition-colors ${
												post.likes.includes(user?._id) ? "text-pink-500" : ""
											}`}
											onClick={(e) => {
												e.stopPropagation();
												likeOn(post._id);
											}}
											whileHover={{ scale: 1.05 }}
										>
											<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
												<HiHeart
													className={
														post.likes.includes(user?._id)
															? "text-pink-500"
															: "text-gray-500 dark:text-gray-400"
													}
												/>
											</div>
											<span className="text-sm">{post.likesNumber}</span>
										</motion.button>
										<motion.button
											className="flex items-center gap-2 hover:text-primary group transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											<div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
												<HiChartBar />
											</div>
											<span className="text-sm">{post.views || 0}</span>
										</motion.button>
										<motion.button
											className="hover:text-primary group transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											<div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
												<HiUpload />
											</div>
										</motion.button>
									</div>
								</div>
							</div>
						</motion.div>
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
