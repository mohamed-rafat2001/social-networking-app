import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../providers/ThemeProvider";
import { Avatar } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import {
	useLikePost,
	useSharePost,
	useIncrementView,
	useDeletePost,
	useUpdatePost,
} from "../hooks/usePostQueries";
import { HiRefresh } from "react-icons/hi";
import { toast } from "react-hot-toast";
import PostItemHeader from "./detail/PostItemHeader";
import PostItemContent from "./detail/PostItemContent";
import PostItemActions from "./detail/PostItemActions";
import PostItemModals from "./detail/PostItemModals";

function PostItem({ post, index }) {
	const navigate = useNavigate();
	const { user } = useUser();
	const { darkMode } = useTheme();
	const { mutate: likePost } = useLikePost();
	const { mutate: sharePost } = useSharePost();
	const { mutate: incrementView } = useIncrementView();
	const { mutate: deletePost } = useDeletePost();
	const { mutate: updatePost } = useUpdatePost();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
	const [repostNote, setRepostNote] = useState("");
	const [editContent, setEditContent] = useState(post.text || "");

	const isShare = post.type === "share";
	const isOwner =
		user?._id === (isShare ? post.sharedBy?._id : post.userId?._id);

	const postRef = useRef(null);
	const viewIncremented = useRef(false);

	const handleDelete = () => {
		deletePost(post._id);
	};

	const handleUpdate = (e) => {
		e.stopPropagation();
		if (!editContent.trim()) return;
		updatePost(
			{ postId: post._id, postData: { text: editContent } },
			{
				onSuccess: () => setIsEditModalOpen(false),
			}
		);
	};

	const handleRepost = () => {
		sharePost(
			{ postId: post.originalPostId || post._id },
			{
				onSuccess: () => {
					toast.success("Reposted successfully");
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to repost");
				},
			}
		);
	};

	const handleRepostWithNote = () => {
		if (!repostNote.trim()) return;
		sharePost(
			{ postId: post.originalPostId || post._id, note: repostNote },
			{
				onSuccess: () => {
					setIsRepostModalOpen(false);
					setRepostNote("");
					toast.success("Reposted with note");
				},
				onError: (error) => {
					toast.error(error.response?.data?.message || "Failed to repost");
				},
			}
		);
	};

	const closeRepostModal = () => {
		setIsRepostModalOpen(false);
		setRepostNote("");
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !viewIncremented.current) {
					incrementView(post.originalPostId || post._id);
					viewIncremented.current = true;
				}
			},
			{ threshold: 0.5 }
		);

		if (postRef.current) {
			observer.observe(postRef.current);
		}

		return () => observer.disconnect();
	}, [post._id, post.originalPostId, incrementView]);

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

	const displayUser = isShare ? post.sharedBy : post.userId;

	return (
		<>
			<motion.div
				ref={postRef}
				layout
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95 }}
				className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden mb-4 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 shadow-sm cursor-pointer"
				onClick={goToDetail}
			>
				<div className="p-4">
					<div className="flex gap-3">
						<Link
							to={`/profile/${displayUser?._id}`}
							onClick={(e) => e.stopPropagation()}
							className="flex-shrink-0"
						>
							<Avatar
								src={displayUser?.image?.secure_url}
								alt={displayUser?.firstName}
								size="md"
							/>
						</Link>

						<div className="flex-1 min-w-0">
							<PostItemHeader
								post={post}
								isOwner={isOwner}
								isShare={isShare}
								displayUser={displayUser}
								setIsEditModalOpen={setIsEditModalOpen}
								setIsDeleteModalOpen={setIsDeleteModalOpen}
							/>

							<PostItemContent post={post} isShare={isShare} />

							<PostItemActions
								post={post}
								user={user}
								isShare={isShare}
								handleLike={handleLike}
								handleRepost={handleRepost}
								setIsRepostModalOpen={setIsRepostModalOpen}
								goToDetail={goToDetail}
							/>
						</div>
					</div>
				</div>
			</motion.div>

			<PostItemModals
				post={post}
				user={user}
				darkMode={darkMode}
				isEditModalOpen={isEditModalOpen}
				setIsEditModalOpen={setIsEditModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				isRepostModalOpen={isRepostModalOpen}
				setIsRepostModalOpen={setIsRepostModalOpen}
				editContent={editContent}
				setEditContent={setEditContent}
				repostNote={repostNote}
				setRepostNote={setRepostNote}
				handleUpdate={handleUpdate}
				handleDelete={handleDelete}
				handleRepostWithNote={handleRepostWithNote}
				closeRepostModal={closeRepostModal}
			/>
		</>
	);
}

export default PostItem;
