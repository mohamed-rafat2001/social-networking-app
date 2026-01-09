import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
	HiArrowLeft,
	HiDotsHorizontal,
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiChartBar,
	HiUpload,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import {
	useSinglePost,
	useLikePost,
	useSharePost,
	useIncrementView,
} from "../features/posts/hooks/usePostQueries";
import { useUser } from "../shared/hooks/useUser";
import { Avatar, Spinner, Button } from "../shared/components/UI";
import CommentList from "../features/posts/components/CommentList";

function PostDetailPage() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const { user } = useUser();
	const { data: postData, isLoading, isError } = useSinglePost(postId);
	const { mutate: likePost } = useLikePost();
	const { mutate: sharePost } = useSharePost();
	const { mutate: incrementView } = useIncrementView();

	const viewIncremented = useRef(false);

	useEffect(() => {
		if (postData?.data && !viewIncremented.current) {
			incrementView(postId);
			viewIncremented.current = true;
		}
	}, [postId, postData, incrementView]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner size="lg" />
			</div>
		);
	}

	if (isError || !postData?.data) {
		return (
			<div className="flex flex-col items-center justify-center h-screen gap-4">
				<p className="text-gray-500 dark:text-gray-400">Post not found</p>
				<Button onClick={() => navigate("/feed")}>Go back to feed</Button>
			</div>
		);
	}

	const post = postData.data;

	const handleLike = () => {
		likePost(post._id);
	};

	const handleShare = () => {
		sharePost(post._id);
	};

	return (
		<div className="w-full max-w-2xl mx-auto border-x dark:border-gray-800 min-h-screen bg-white dark:bg-gray-900">
			{/* Header */}
			<div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 z-20 px-4 py-3 flex items-center gap-8">
				<button
					onClick={() => navigate(-1)}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
				>
					<HiArrowLeft className="text-xl" />
				</button>
				<div>
					<h1 className="text-xl font-bold">Post</h1>
					<p className="text-xs text-gray-500">Thread</p>
				</div>
			</div>

			{/* Post Content */}
			<div className="p-4">
				<div className="flex gap-3 mb-4">
					<Avatar src={post.userId?.image?.secure_url} size="lg" />
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start">
							<div>
								<Link
									to={`/profile/${post.userId?._id}`}
									className="font-bold text-lg hover:underline cursor-pointer block"
								>
									{post.userId?.firstName} {post.userId?.lastName}
								</Link>
								<p className="text-gray-500 dark:text-gray-400">
									@{post.userId?.firstName?.toLowerCase()}
								</p>
							</div>
							<button className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
								<HiDotsHorizontal />
							</button>
						</div>
					</div>
				</div>

				<p className="text-xl text-black dark:text-gray-100 leading-relaxed break-words mb-4">
					{post.text}
				</p>

				{post.fileUp?.map((file) => (
					<div
						key={file.public_id}
						className="rounded-2xl overflow-hidden border dark:border-gray-800 mb-4 bg-gray-50 dark:bg-gray-800/50"
					>
						<img
							src={file.secure_url}
							alt="Post content"
							className="w-full h-auto object-contain"
						/>
					</div>
				))}

				<div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4 pb-4 border-b dark:border-gray-800">
					<span>
						{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
							? new Date(post.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
							  })
							: ""}
					</span>
					<span>·</span>
					<span>
						{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
							? new Date(post.createdAt).toLocaleDateString([], {
									month: "short",
									day: "numeric",
									year: "numeric",
							  })
							: ""}
					</span>
					<span>·</span>
					<span className="font-bold text-black dark:text-white">
						{post.views || 0}
					</span>
					<span>Views</span>
				</div>

				<div className="flex justify-around py-1 border-b dark:border-gray-800 text-gray-500 dark:text-gray-400">
					<button className="flex items-center gap-2 hover:text-primary group transition-colors flex-1 justify-center">
						<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
							<HiChatAlt2 className="text-xl" />
						</div>
						<span className="text-sm font-medium">
							{post.comments?.length || 0}
						</span>
					</button>
					<button
						onClick={handleShare}
						className={`flex items-center gap-2 hover:text-green-500 group transition-colors flex-1 justify-center ${
							post.shares?.some(
								(s) => (s.userId?._id || s.userId) === user?._id?.toString()
							)
								? "text-green-500"
								: ""
						}`}
					>
						<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
							<HiRefresh className="text-xl" />
						</div>
						<span className="text-sm font-medium">
							{post.shares?.length || 0}
						</span>
					</button>
					<button
						onClick={handleLike}
						className={`flex items-center gap-2 hover:text-pink-500 group transition-colors flex-1 justify-center ${
							post.likes?.includes(user?._id) ? "text-pink-500" : ""
						}`}
					>
						<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
							{post.likes?.includes(user?._id) ? (
								<HiHeart className="text-xl text-pink-500" />
							) : (
								<HiHeart className="text-xl" />
							)}
						</div>
						<span className="text-sm font-medium">{post.likesNumber || 0}</span>
					</button>
					<button className="flex items-center gap-2 hover:text-primary group transition-colors flex-1 justify-center">
						<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
							<HiUpload className="text-xl" />
						</div>
					</button>
				</div>
			</div>

			{/* Comments Section */}
			<div className="pb-20">
				{post.comments && (
					<CommentList comments={post.comments} postId={post._id} />
				)}
			</div>
		</div>
	);
}

export default PostDetailPage;
