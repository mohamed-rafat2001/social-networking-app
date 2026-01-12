import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ImageGallery, Avatar, cn } from "../../../../shared/components/ui";

const PostItemContent = ({
	post,
	isShare,

	user,
}) => {
	const originalAuthor = post.userId;
	const originalDate = post.createdAt;
	const originalPost = post.originalPost || post;

	return (
		<>
			{/* Reposter's Note (only if it's a share) */}
			{isShare && post.shareNote && (
				<p className="mt-1 mb-3 text-[15px] text-gray-900 dark:text-gray-200 leading-normal break-words whitespace-pre-wrap">
					{post.shareNote}
				</p>
			)}

			{/* Original Post Content */}
			{isShare ? (
				<div className="mt-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
					<div className="flex items-center gap-2 mb-2">
						<Avatar
							src={originalAuthor?.image?.secure_url}
							alt={originalAuthor?.firstName}
							size="xs"
						/>
						<div className="flex items-center gap-1 flex-wrap">
							<span className="font-bold text-[14px] text-gray-900 dark:text-white">
								{originalAuthor?.firstName} {originalAuthor?.lastName}
							</span>
							<span className="text-gray-500 dark:text-gray-400 text-[13px]">
								@{originalAuthor?.firstName?.toLowerCase()}
							</span>
							<span className="text-gray-500 dark:text-gray-400">·</span>
							<span className="text-gray-500 dark:text-gray-400 text-[13px]">
								{originalDate && !isNaN(new Date(originalDate).getTime())
									? formatDistanceToNow(new Date(originalDate), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
					</div>

					{post.text && (
						<p className="mb-3 text-[14px] text-gray-800 dark:text-gray-300 leading-normal break-words whitespace-pre-wrap">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery
							images={post.fileUp}
							className="rounded-lg shadow-sm"
						/>
					)}
				</div>
			) : (
				<>
					{post.text && (
						<p className="mt-1 mb-3 text-[15px] text-gray-900 dark:text-gray-200 leading-normal break-words whitespace-pre-wrap">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery images={post.fileUp} className="mb-3 shadow-sm" />
					)}
				</>
			)}
		</>
	);
};

export default PostItemContent;
