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
					className="mt-2 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer group/quoted shadow-sm"
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
							className="group-hover/quoted:ring-2 group-hover/quoted:ring-primary/20 transition-all"
						/>
						<div className="flex items-center gap-1.5 flex-wrap min-w-0">
							<span className="font-bold text-[14px] text-slate-900 dark:text-white leading-tight truncate">
								{originalAuthor?.firstName} {originalAuthor?.lastName}
							</span>
							<span className="text-slate-500 dark:text-slate-500 text-[13px] truncate">
								@
								{originalAuthor?.username ||
									originalAuthor?.firstName?.toLowerCase()}
							</span>
							<span className="text-slate-400 dark:text-slate-600">·</span>
							<span className="text-slate-500 dark:text-slate-500 text-[13px] whitespace-nowrap">
								{originalDate && !isNaN(new Date(originalDate).getTime())
									? formatDistanceToNow(new Date(originalDate), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
					</div>

					{post.text && (
						<p className="mb-3 text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap line-clamp-6">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
							<ImageGallery
								images={post.fileUp}
								className="w-full"
							/>
						</div>
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
