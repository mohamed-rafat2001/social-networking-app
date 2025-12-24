import { useState } from "react";
import moment from "moment";
import { useUser } from "../../../hooks/useUser.js";
import {
	usePosts,
	useAddPost,
	useLikePost,
	useSharePost,
} from "../hooks/usePostQueries.js";
import InputEmoji from "react-input-emoji";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button } from "../../../ui";

import {
	HiPhotograph,
	HiFilm,
	HiEmojiHappy,
	HiDotsHorizontal,
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiChartBar,
	HiUpload,
} from "react-icons/hi";

function PostList() {
	const [text, setText] = useState("");
	const [file, setFile] = useState(null);

	const { user } = useUser();

	const { data: postsData } = usePosts();
	const { mutate: addPostMutation } = useAddPost();
	const { mutate: likePostMutation } = useLikePost();
	const { mutate: sharePostMutation } = useSharePost();

	const posts = postsData?.data || [];

	const likeOn = (id) => {
		likePostMutation(id);
	};
	const addShare = (id) => {
		sharePostMutation(id);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!text.trim() && !file) return;

		if (!file) {
			addPostMutation({ text });
			setText("");
			return;
		}

		let data = new FormData();
		file.forEach((f) => {
			data.append("filess", f);
		});
		data.append("text", text);
		addPostMutation(data);
		setText("");
		setFile(null);
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
						<div className="mb-2 dark:text-white">
							<InputEmoji
								value={text}
								type="text"
								placeholder="What is happening?!"
								onChange={setText}
								fontSize={18}
								borderRadius={0}
								borderColor="transparent"
								theme="auto"
							/>
						</div>
						<div className="flex justify-between items-center mt-2 pt-2 border-t dark:border-gray-800">
							<div className="flex gap-1 text-primary">
								<label
									htmlFor="image"
									className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
								>
									<HiPhotograph className="text-xl" />
								</label>
								<input
									type="file"
									className="hidden"
									onChange={(e) =>
										setFile((prev) => [...e.target.files, ...(prev || [])])
									}
									multiple
									id="image"
								/>
								<button
									type="button"
									className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
								>
									<HiFilm className="text-xl" />
								</button>
								<button
									type="button"
									className="hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
								>
									<HiEmojiHappy className="text-xl" />
								</button>
							</div>
							<Button
								type="submit"
								className="px-5 py-2"
								disabled={!text.trim() && !file}
							>
								Post
							</Button>
						</div>
					</form>
				</div>
			</div>

			{/* Posts List */}
			<AnimatePresence initial={false}>
				{posts?.data ? (
					posts.data.map((post, index) => (
						<motion.div
							key={post._id}
							className="border-b dark:border-gray-800 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-all"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
							layout
						>
							<div className="flex gap-3">
								<Avatar src={post.userId.image?.secure_url} />
								<div className="flex-1">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-1 flex-wrap">
											<span className="font-bold text-black dark:text-white hover:underline">
												{post.userId.firstName} {post.userId.lastName}
											</span>
											<span className="text-gray-500 dark:text-gray-400">
												@{post.userId.firstName.toLowerCase()}
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
											className="rounded-2xl overflow-hidden border dark:border-gray-800 mb-3"
											initial={{ opacity: 0, scale: 0.98 }}
											animate={{ opacity: 1, scale: 1 }}
										>
											<img
												className="w-full object-cover max-h-[512px]"
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
					<div className="flex justify-center items-center p-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default PostList;
