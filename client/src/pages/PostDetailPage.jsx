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
import {
	Avatar,
	Spinner,
	Button,
	ImageGallery,
	cn,
} from "../shared/components/UI";
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
			<div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-[60] px-4 py-3 flex items-center gap-8">
				<button
					onClick={() => navigate(-1)}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white"
				>
					<HiArrowLeft className="text-xl" />
				</button>
				<div>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						Post
					</h1>
					<p className="text-xs text-gray-500">Thread</p>
				</div>
			</div>

			{/* Post Content */}
			<div className="p-4">
				<div className="flex gap-4 mb-4">
					<Link to={`/profile/${post.userId?._id}`} className="shrink-0">
						<Avatar src={post.userId?.image?.secure_url} size="lg" />
					</Link>
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start pt-1">
							<div>
								<Link
									to={`/profile/${post.userId?._id}`}
									className="font-bold text-[17px] hover:underline cursor-pointer block leading-tight text-gray-900 dark:text-white"
								>
									{post.userId?.firstName} {post.userId?.lastName}
								</Link>
								<p className="text-[15px] text-gray-500 dark:text-gray-400">
									@{post.userId?.firstName?.toLowerCase()}
								</p>
							</div>
							<button className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors -mt-2">
								<HiDotsHorizontal size={18} />
							</button>
						</div>
					</div>
				</div>

				<p className="text-xl md:text-[22px] text-gray-900 dark:text-gray-100 leading-normal break-words mb-4 whitespace-pre-wrap">
					{post.text}
				</p>

				{post.fileUp && post.fileUp.length > 0 && (
					<ImageGallery images={post.fileUp} className="mb-4 shadow-sm" />
				)}

				<div className="flex flex-wrap items-center gap-1 text-[15px] text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b dark:border-gray-800">
					<span>
						{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
							? new Date(post.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
							  })
							: ""}
					</span>
					<span className="mx-1">·</span>
					<span>
						{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
							? new Date(post.createdAt).toLocaleDateString([], {
									month: "short",
									day: "numeric",
									year: "numeric",
							  })
							: ""}
					</span>
					<span className="mx-1">·</span>
					<div className="flex items-center gap-1">
						<span className="font-bold text-gray-900 dark:text-white">
							{post.views || 0}
						</span>
						<span>Views</span>
					</div>
				</div>

				<div className="flex items-center gap-6 py-1 border-b dark:border-gray-800 text-gray-500 dark:text-gray-400">
					<button className="flex items-center gap-2 hover:text-primary group transition-colors">
						<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
							<HiChatAlt2 className="text-[22px]" />
						</div>
						<span className="text-[15px] font-medium">
							{post.comments?.length || 0}
						</span>
					</button>
					<button
						onClick={handleShare}
						className={cn(
							"flex items-center gap-2 hover:text-green-500 group transition-colors",
							post.shares?.some(
								(s) => (s.userId?._id || s.userId) === user?._id?.toString()
							) && "text-green-500"
						)}
					>
						<div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
							<HiRefresh className="text-[22px]" />
						</div>
						<span className="text-[15px] font-medium">
							{post.shares?.length || 0}
						</span>
					</button>
					<button
						onClick={handleLike}
						className={cn(
							"flex items-center gap-2 hover:text-pink-500 group transition-colors",
							post.likes?.includes(user?._id) && "text-pink-500"
						)}
					>
						<div className="p-2 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
							{post.likes?.includes(user?._id) ? (
								<HiHeart className="text-[22px] text-pink-500" />
							) : (
								<HiHeart className="text-[22px]" />
							)}
						</div>
						<span className="text-[15px] font-medium">
							{post.likesNumber || 0}
						</span>
					</button>
					<button className="flex items-center gap-2 hover:text-primary group transition-colors ml-auto">
						<div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
							<HiUpload className="text-[22px]" />
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
