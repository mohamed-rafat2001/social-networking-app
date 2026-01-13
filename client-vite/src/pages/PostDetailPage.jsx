import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../providers/ThemeProvider";
import { useSinglePost } from "../features/posts/hooks/usePostQueries";
import { useUser } from "../shared/hooks/useUser";
import { Spinner, Button } from "../shared/components/ui";
import CommentList from "../features/posts/components/CommentList";
import PostDetailHeader from "../features/posts/components/detail/PostDetailHeader";
import PostDetailContent from "../features/posts/components/detail/PostDetailContent";
import PostDetailActions from "../features/posts/components/detail/PostDetailActions";
import PostDetailModals from "../features/posts/components/detail/PostDetailModals";
import { usePostDetail } from "../features/posts/hooks/usePostDetail";

function PostDetailPage() {
	const { postId } = useParams();
	const navigate = useNavigate();
	const { user } = useUser();
	const { darkMode } = useTheme();
	const { data: postData, isLoading, isError } = useSinglePost(postId);

	const {
		isEditModalOpen,
		setIsEditModalOpen,
		isDeleteModalOpen,
		setIsDeleteModalOpen,
		isRepostModalOpen,
		setIsRepostModalOpen,
		repostNote,
		setRepostNote,
		editContent,
		setEditContent,
		handleLike,
		handleRepost,
		handleRepostWithNote,
		handleDelete,
		handleUpdate,
	} = usePostDetail(postId, postData);

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
							handleRepost={handleRepost}
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

			<PostDetailModals
				post={post}
				darkMode={darkMode}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				handleDelete={handleDelete}
				isEditModalOpen={isEditModalOpen}
				setIsEditModalOpen={setIsEditModalOpen}
				editContent={editContent}
				setEditContent={setEditContent}
				handleUpdate={handleUpdate}
				isRepostModalOpen={isRepostModalOpen}
				setIsRepostModalOpen={setIsRepostModalOpen}
				repostNote={repostNote}
				setRepostNote={setRepostNote}
				handleRepostWithNote={handleRepostWithNote}
			/>
		</div>
	);
}

export default PostDetailPage;
