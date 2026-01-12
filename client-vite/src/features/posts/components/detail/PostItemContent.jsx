import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ImageGallery, Avatar } from "../../../../shared/components/ui";

const PostItemContent = ({ post, isShare }) => {
	const navigate = useNavigate();
	const originalAuthor = post.userId;
	const originalDate = post.createdAt;

	return (
		<>
			{/* Reposter's Note (only if it's a share) */}
			{isShare && post.shareNote && (
				<p className="mt-1 mb-3 text-[15px] text-slate-900 dark:text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
					{post.shareNote}
				</p>
			)}

			{/* Original Post Content */}
			{isShare ? (
				<div
					className="mt-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/posts/${post.originalPostId}`);
					}}
				>
					<div className="flex items-center gap-2 mb-2">
						<Avatar
							src={originalAuthor?.image?.secure_url}
							alt={originalAuthor?.firstName}
							size="xs"
						/>
						<div className="flex items-center gap-1 flex-wrap">
							<span className="font-bold text-[14px] text-slate-900 dark:text-white leading-tight">
								{originalAuthor?.firstName} {originalAuthor?.lastName}
							</span>
							<span className="text-slate-500 dark:text-slate-400 text-[13px]">
								@
								{originalAuthor?.username ||
									originalAuthor?.firstName?.toLowerCase()}
							</span>
							<span className="text-slate-400 dark:text-slate-600">·</span>
							<span className="text-slate-500 dark:text-slate-400 text-[13px]">
								{originalDate && !isNaN(new Date(originalDate).getTime())
									? formatDistanceToNow(new Date(originalDate), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
					</div>

					{post.text && (
						<p className="mb-3 text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery
							images={post.fileUp}
							className="rounded-xl overflow-hidden shadow-sm"
						/>
					)}
				</div>
			) : (
				<>
					{post.text && (
						<p className="mt-1 mb-3 text-[15px] text-slate-900 dark:text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery
							images={post.fileUp}
							className="mb-3 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
						/>
					)}
				</>
			)}
		</>
	);
};

export default PostItemContent;
