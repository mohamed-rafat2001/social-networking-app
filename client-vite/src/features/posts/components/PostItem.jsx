import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../providers/ThemeProvider";
import { Avatar } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { usePostActions } from "../hooks/usePostActions";
import PostItemHeader from "./detail/PostItemHeader";
import PostItemContent from "./detail/PostItemContent";
import PostItemActions from "./detail/PostItemActions";
import PostItemModals from "./detail/PostItemModals";

function PostItem({ post }) {
	const navigate = useNavigate();
	const { user } = useUser();
	const { darkMode } = useTheme();

	const {
		postRef,
		isOwner,
		isShare,
		displayUser,
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
		handleDelete,
		handleUpdate,
		handleRepost,
		handleRepostWithNote,
		closeRepostModal,
		handleLike,
		goToDetail,
	} = usePostActions(post, user);

	return (
		<motion.article
			ref={postRef}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group/post"
			onClick={() => navigate(`/posts/${post._id}`)}
		>
			<div className="flex gap-3">
				<div className="flex flex-col items-center gap-2">
					<Link
						to={`/profile/${displayUser?._id}`}
						onClick={(e) => e.stopPropagation()}
						className="shrink-0"
					>
						<Avatar
							src={displayUser?.image?.secure_url}
							alt={displayUser?.firstName}
							size="md"
							className="ring-2 ring-transparent group-hover/post:ring-primary/20 transition-all"
						/>
					</Link>
					{isShare && (
						<div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
					)}
				</div>

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
						handleLike={handleLike}
						handleRepost={handleRepost}
						setIsRepostModalOpen={setIsRepostModalOpen}
						goToDetail={goToDetail}
					/>
				</div>
			</div>

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
		</motion.article>
	);
}

export default PostItem;
