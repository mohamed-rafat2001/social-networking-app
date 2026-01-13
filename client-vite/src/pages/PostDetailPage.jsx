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
				<p className="text-slate-500 dark:text-slate-400">Post not found</p>
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

	const handleRepostWithNote = () => {
		const originalPostId = post.originalPostId || post._id;
		sharePost(
			{ postId: originalPostId, note: repostNote },
			{
				onSuccess: () => {
					setIsRepostModalOpen(false);
					setRepostNote("");
					toast.success(
						repostNote.trim() ? "Reposted with note" : "Reposted successfully"
					);
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
		<div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
			{/* Detail Header */}
			<div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
				<div className="flex items-center h-14 px-4 gap-8">
					<button
						onClick={() => navigate(-1)}
						className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
					>
						<svg
							className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
					</button>
					<h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
						Post
					</h1>
				</div>
			</div>

			<div className="max-w-2xl mx-auto w-full">
				<article className="p-0 border-b border-slate-100 dark:border-slate-800">
					<PostDetailHeader
						post={post}
						isOwner={isOwner}
						onEdit={() => setIsEditModalOpen(true)}
						onDelete={() => setIsDeleteModalOpen(true)}
					/>

					<PostDetailContent post={post} />

					<div className="py-1 border-y border-slate-100 dark:border-slate-800">
						<PostDetailActions
							post={post}
							user={user}
							handleLike={handleLike}
							setIsRepostModalOpen={setIsRepostModalOpen}
						/>
					</div>

					<CommentList 
						postId={postId} 
						comments={post.comments} 
						recipientId={post.userId?._id}
					/>
				</article>
			</div>

			{/* Modals */}
			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Post?"
				message="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
				confirmText="Delete"
				variant="danger"
			/>

			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Post"
			>
				<div className="space-y-4">
					<div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
						<Textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="min-h-[150px] bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400"
							placeholder="What's happening?"
						/>
					</div>
					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => setIsEditModalOpen(false)}
							className="rounded-full font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdate}
							className="rounded-full px-8 font-black shadow-lg shadow-primary/20"
						>
							Save Changes
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				isOpen={isRepostModalOpen}
				onClose={() => setIsRepostModalOpen(false)}
				title="Repost with note"
			>
				<div className="space-y-4">
					<div className="post-input-container bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
						<InputEmoji
							value={repostNote}
							onChange={setRepostNote}
							placeholder="Add a comment..."
							theme={darkMode ? "dark" : "light"}
							fontSize={16}
						/>
					</div>
					<div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
						<PostDetailHeader post={post} isOwner={false} isMinimal />
						<div className="mt-3 text-slate-600 dark:text-slate-300 line-clamp-3 text-[15px] leading-relaxed">
							{post.text}
						</div>
					</div>
					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => setIsRepostModalOpen(false)}
							className="rounded-full font-bold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
						>
							Cancel
						</Button>
						<Button
							onClick={handleRepostWithNote}
							className="rounded-full px-8 font-black shadow-lg shadow-primary/20"
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
