import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
	Avatar,
	Dropdown,
	DropdownItem,
	ImageGallery,
	cn,
} from "../../../../shared/components/ui";
import {
	HiDotsHorizontal,
	HiOutlinePencil,
	HiOutlineTrash,
	HiChatAlt2,
	HiRefresh,
	HiHeart,
	HiChartBar,
} from "react-icons/hi";

const PostDetailContent = ({
	post,
	isOwner,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
	onLike,
	onRepost,
	onComment,
	user,
}) => {
	const navigate = useNavigate();
	const isShare = post.type === "share";
	const originalAuthor = post.originalPost?.userId || post.userId;
	const originalDate = post.originalPost?.createdAt || post.createdAt;
	const originalPost = post.originalPost || post;

	const isLiked = originalPost.likes?.some(
		(like) => (like._id || like) === user?._id
	);
	const isShared = originalPost.shares?.some(
		(share) => (share.userId?._id || share.userId) === user?._id
	);

	return (
		<div className="p-4">
			<div className="flex gap-4 mb-4">
				<Link
					to={`/profile/${isShare ? post.sharedBy?._id : post.userId?._id}`}
					className="shrink-0"
				>
					<Avatar
						src={
							isShare
								? post.sharedBy?.image?.secure_url
								: post.userId?.image?.secure_url
						}
						size="lg"
					/>
				</Link>
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-start pt-1">
						<div>
							<Link
								to={`/profile/${
									isShare ? post.sharedBy?._id : post.userId?._id
								}`}
								className="font-bold text-[17px] hover:underline cursor-pointer block leading-tight text-gray-900 dark:text-white"
							>
								{isShare
									? `${post.sharedBy?.firstName} ${post.sharedBy?.lastName}`
									: `${post.userId?.firstName} ${post.userId?.lastName}`}
							</Link>
							<p className="text-[15px] text-gray-500 dark:text-gray-400">
								@
								{isShare
									? post.sharedBy?.firstName?.toLowerCase()
									: post.userId?.firstName?.toLowerCase()}
							</p>
						</div>

						{isOwner && (
							<div className="ml-auto">
								<Dropdown
									trigger={
										<button className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
											<HiDotsHorizontal size={18} />
										</button>
									}
								>
									<DropdownItem
										icon={HiOutlinePencil}
										onClick={() => setIsEditModalOpen(true)}
									>
										Edit Post
									</DropdownItem>
									<DropdownItem
										variant="danger"
										icon={HiOutlineTrash}
										onClick={() => setIsDeleteModalOpen(true)}
									>
										Delete Post
									</DropdownItem>
								</Dropdown>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Reposter's Note */}
			{isShare && post.shareNote && (
				<p className="text-[18px] md:text-[20px] text-gray-900 dark:text-gray-100 leading-normal break-words mb-4 whitespace-pre-wrap">
					{post.shareNote}
				</p>
			)}

			{/* Post Content / Original Post Content */}
			{isShare ? (
				<div
					className="mt-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
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
						<p className="mb-3 text-[15px] text-gray-800 dark:text-gray-300 leading-normal break-words whitespace-pre-wrap">
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
					<p className="text-[18px] md:text-[20px] text-gray-900 dark:text-gray-100 leading-normal break-words mb-4 whitespace-pre-wrap">
						{post.text}
					</p>

					{post.fileUp && post.fileUp.length > 0 && (
						<ImageGallery images={post.fileUp} className="mb-4 shadow-sm" />
					)}
				</>
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
			</div>
		</div>
	);
};

export default PostDetailContent;
