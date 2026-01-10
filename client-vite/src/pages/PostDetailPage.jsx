import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputEmoji from "react-input-emoji";
import { useTheme } from "../providers/ThemeProvider";
import {
	useSinglePost,
	useLikePost,
	useSharePost,
	useIncrementView,
	useDeletePost,
	useUpdatePost,
} from "../features/posts/hooks/usePostQueries";
import { useUser } from "../shared/hooks/useUser";
import {
	Spinner,
	ConfirmModal,
	Button,
	Textarea,
	Modal,
} from "../shared/components/ui";
import CommentList from "../features/posts/components/CommentList";
import { toast } from "react-hot-toast";

// New sub-components
import PostDetailHeader from "../features/posts/components/detail/PostDetailHeader";
import PostDetailContent from "../features/posts/components/detail/PostDetailContent";
import PostDetailActions from "../features/posts/components/detail/PostDetailActions";

function PostDetailPage() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const { user } = useUser();
	const { darkMode } = useTheme();
	const { data: postData, isLoading, isError } = useSinglePost(postId);
	const { mutate: likePost } = useLikePost();
	const { mutate: sharePost } = useSharePost();
	const { mutate: incrementView } = useIncrementView();
	const { mutate: deletePost } = useDeletePost();
	const { mutate: updatePost } = useUpdatePost();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
	const [repostNote, setRepostNote] = useState("");
	const [editContent, setEditContent] = useState("");

	const viewIncremented = useRef(false);

	useEffect(() => {
		if (postData?.data && !viewIncremented.current) {
			incrementView(postId);
			viewIncremented.current = true;
		}
		if (postData?.data) {
			setEditContent(postData.data.text || "");
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
	const isShare = post.type === "share";
	const isOwner =
		user?._id === (isShare ? post.sharedBy?._id : post.userId?._id);

	const handleLike = () => {
		likePost(post._id);
	};

	const handleShare = () => {
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

	const handleDelete = () => {
		deletePost(post._id, {
			onSuccess: () => {
				toast.success("Post deleted");
				navigate("/feed");
			},
		});
	};

	const handleUpdate = () => {
		if (!editContent.trim()) return;
		updatePost(
			{ postId: post._id, postData: { text: editContent } },
			{
				onSuccess: () => {
					setIsEditModalOpen(false);
					toast.success("Post updated");
				},
			}
		);
	};

	return (
		<div className="w-full max-w-2xl mx-auto border-x dark:border-gray-800 min-h-screen bg-white dark:bg-gray-900">
			<PostDetailHeader onBack={() => navigate(-1)} />

			<PostDetailContent
				post={post}
				isOwner={isOwner}
				isShare={isShare}
				setIsEditModalOpen={setIsEditModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
			/>

			<PostDetailActions
				post={post}
				user={user}
				isShare={isShare}
				handleLike={handleLike}
				handleShare={handleShare}
				setIsRepostModalOpen={setIsRepostModalOpen}
			/>

			{/* Comments Section */}
			<CommentList postId={post._id} comments={post.comments} />

			{/* Modals */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Post"
			>
				<div className="space-y-4">
					<Textarea
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
						placeholder="What's on your mind?"
						className="min-h-[150px]"
					/>
					<div className="flex justify-end gap-3">
						<Button
							variant="secondary"
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdate}>Save Changes</Button>
					</div>
				</div>
			</Modal>

			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Post"
				message="Are you sure you want to delete this post? This action cannot be undone."
				confirmText="Delete Post"
			/>

			<Modal
				isOpen={isRepostModalOpen}
				onClose={closeRepostModal}
				title="Repost with note"
			>
				<div className="space-y-4">
					<div className="emoji-input-container relative z-[60]">
						<style>
							{`
								.emoji-input-container .react-input-emoji--picker-wrapper {
									z-index: 1000 !important;
									position: absolute !important;
									bottom: 100% !important;
									right: 0 !important;
								}
								.emoji-input-container .react-input-emoji--button {
									z-index: 100 !important;
								}
							`}
						</style>
						<InputEmoji
							value={repostNote}
							onChange={setRepostNote}
							placeholder="Add a comment..."
							theme={darkMode ? "dark" : "light"}
						/>
					</div>
					<div className="flex justify-end gap-3 px-2">
						<Button variant="secondary" onClick={closeRepostModal}>
							Cancel
						</Button>
						<Button
							onClick={handleRepostWithNote}
							disabled={!repostNote.trim()}
						>
							Repost
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default PostDetailPage;
