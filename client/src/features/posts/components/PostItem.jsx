import { useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar } from "../../../shared/components/UI";
import { useUser } from "../../../shared/hooks/useUser";
import {
	useLikePost,
	useSharePost,
	useIncrementView,
} from "../hooks/usePostQueries";
import {
	HiDotsHorizontal,
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiChartBar,
	HiUpload,
} from "react-icons/hi";

function PostItem({ post, index }) {
	const navigate = useNavigate();
	const { user } = useUser();
	const { mutate: likePost } = useLikePost();
	const { mutate: sharePost } = useSharePost();
	const { mutate: incrementView } = useIncrementView();

	const postRef = useRef(null);
	const viewIncremented = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !viewIncremented.current) {
					incrementView(post._id);
					viewIncremented.current = true;
				}
			},
			{ threshold: 0.5 } // 50% of the post must be visible
		);

		if (postRef.current) {
			observer.observe(postRef.current);
		}

		return () => {
			if (postRef.current) {
				observer.unobserve(postRef.current);
			}
		};
	}, [post._id, incrementView]);

	const handleLike = (e) => {
		e.stopPropagation();
		likePost(post._id);
	};

	const handleShare = (e) => {
		e.stopPropagation();
		sharePost(post._id);
	};

	const goToDetail = () => {
		navigate(`/posts/${post._id}`);
	};

	return (
		<motion.div
			ref={postRef}
			className="border-b dark:border-gray-800 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-all"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
			onClick={goToDetail}
			layout
		>
			<div className="flex gap-3">
				<Link
					to={`/profile/${post.userId?._id}`}
					onClick={(e) => e.stopPropagation()}
					className="shrink-0"
				>
					<Avatar src={post.userId?.image?.secure_url} />
				</Link>
				<div className="flex-1">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-1 flex-wrap">
							<Link
								to={`/profile/${post.userId?._id}`}
								className="font-bold text-black dark:text-white hover:underline flex items-center gap-2"
								onClick={(e) => e.stopPropagation()}
							>
								{post.userId?.firstName} {post.userId?.lastName}
							</Link>
							<span className="text-gray-500 dark:text-gray-400">
								@{post.userId?.firstName?.toLowerCase()}
							</span>
							<span className="text-gray-500 dark:text-gray-400">·</span>
							<span className="text-gray-500 dark:text-gray-400 text-sm">
								{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
									? formatDistanceToNow(new Date(post.createdAt), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
						<button
							className="text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
							onClick={(e) => e.stopPropagation()}
						>
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
								loading="lazy"
							/>
						</motion.div>
					)}

					<div className="flex justify-between text-gray-500 dark:text-gray-400 max-w-md mt-2">
						<motion.button
							className="flex items-center gap-2 hover:text-primary group transition-colors"
							whileHover={{ scale: 1.05 }}
							onClick={(e) => {
								e.stopPropagation();
								goToDetail();
							}}
						>
							<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
								<HiChatAlt2 />
							</div>
							<span className="text-sm">{post.comments?.length || 0}</span>
						</motion.button>

						<motion.button
							className={`flex items-center gap-2 hover:text-green-500 group transition-colors ${
								post.shares?.some(
									(s) => (s.userId?._id || s.userId) === user?._id?.toString()
								)
									? "text-green-500"
									: ""
							}`}
							onClick={handleShare}
							whileHover={{ scale: 1.05 }}
						>
							<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
								<HiRefresh />
							</div>
							<span className="text-sm">{post.shares?.length || 0}</span>
						</motion.button>

						<motion.button
							className={`flex items-center gap-2 hover:text-pink-500 group transition-colors ${
								post.likes?.includes(user?._id) ? "text-pink-500" : ""
							}`}
							onClick={handleLike}
							whileHover={{ scale: 1.05 }}
						>
							<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
								<HiHeart
									className={
										post.likes?.includes(user?._id)
											? "text-pink-500"
											: "text-gray-500 dark:text-gray-400"
									}
								/>
							</div>
							<span className="text-sm">{post.likesNumber || 0}</span>
						</motion.button>

						<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
							<div className="p-2 rounded-full">
								<HiChartBar />
							</div>
							<span className="text-sm">{post.views || 0}</span>
						</div>

						<motion.button
							className="hover:text-primary group transition-colors"
							whileHover={{ scale: 1.05 }}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
								<HiUpload />
							</div>
						</motion.button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default PostItem;
