import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
	Avatar,
	Dropdown,
	DropdownItem,
	ImageGallery,
} from "../../../../shared/components/ui";
import {
	HiDotsHorizontal,
	HiOutlinePencil,
	HiOutlineTrash,
} from "react-icons/hi";

const PostDetailContent = ({
	post,
	isOwner,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
	user,
}) => {
	const navigate = useNavigate();
	const isShare = post.type === "share";
	const originalAuthor = post.originalPost?.userId || post.userId;
	const originalDate = post.originalPost?.createdAt || post.createdAt;

	return (
		<div className="px-4 pb-4">
			{/* Reposter's Note */}
			{isShare && post.shareNote && (
				<p className="text-[19px] md:text-[21px] text-slate-900 dark:text-white leading-relaxed break-words mb-4 whitespace-pre-wrap font-medium">
					{post.shareNote}
				</p>
			)}

			{/* Post Content / Original Post Content */}
			{isShare ? (
				<div
					className="mt-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
					onClick={(e) => {
						e.stopPropagation();
						navigate(`/posts/${post.originalPostId}`);
					}}
				>
					<div className="flex items-center gap-2 mb-3">
						<Avatar
							src={originalAuthor?.image?.secure_url}
							alt={originalAuthor?.firstName}
							size="xs"
						/>
						<div className="flex items-center gap-1.5 flex-wrap min-w-0">
							<span className="font-bold text-[15px] text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
								{originalAuthor?.firstName} {originalAuthor?.lastName}
							</span>
							<span className="text-slate-500 dark:text-slate-400 text-[14px] truncate">
								@
								{originalAuthor?.username ||
									originalAuthor?.firstName?.toLowerCase()}
							</span>
							<span className="text-slate-400">·</span>
							<span className="text-slate-500 dark:text-slate-400 text-[14px]">
								{originalDate && !isNaN(new Date(originalDate).getTime())
									? formatDistanceToNow(new Date(originalDate), {
											addSuffix: true,
									  })
									: "just now"}
							</span>
						</div>
					</div>

					{post.text && (
						<p className="mb-4 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
							{post.text}
						</p>
					)}

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery
							images={post.fileUp}
							className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800"
						/>
					)}
				</div>
			) : (
				<>
					<p className="text-[19px] md:text-[21px] text-slate-900 dark:text-white leading-relaxed break-words mb-4 whitespace-pre-wrap font-medium">
						{post.text}
					</p>

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery
							images={post.fileUp}
							className="mb-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
						/>
					)}
				</>
			)}

			<div className="flex flex-wrap items-center gap-1.5 text-[15px] text-slate-500 dark:text-slate-400 mt-4">
				<span>
					{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
						? new Date(post.createdAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
						  })
						: ""}
				</span>
				<span className="text-slate-300 dark:text-slate-700">·</span>
				<span>
					{post.createdAt && !isNaN(new Date(post.createdAt).getTime())
						? new Date(post.createdAt).toLocaleDateString([], {
								month: "short",
								day: "numeric",
								year: "numeric",
						  })
						: ""}
				</span>
				<span className="text-slate-300 dark:text-slate-700">·</span>
				<span className="font-bold text-slate-900 dark:text-white">
					{post.views || 0}{" "}
					<span className="font-normal text-slate-500">Views</span>
				</span>
			</div>
		</div>
	);
};

export default PostDetailContent;
