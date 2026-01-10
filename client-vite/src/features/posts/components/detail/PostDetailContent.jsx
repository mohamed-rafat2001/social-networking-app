import React from "react";
import { Link } from "react-router-dom";
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
}) => {
	return (
		<div className="p-4">
			<div className="flex gap-4 mb-4">
				<Link to={`/profile/${post.userId?._id}`} className="shrink-0">
					<Avatar src={post.userId?.image?.secure_url} size="lg" />
				</Link>
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-start pt-1">
						<div>
							<Link
								to={`/profile/${post.userId?._id}`}
								className="font-bold text-[17px] hover:underline cursor-pointer block leading-tight text-gray-900 dark:text-white"
							>
								{post.userId?.firstName} {post.userId?.lastName}
							</Link>
							<p className="text-[15px] text-gray-500 dark:text-gray-400">
								@{post.userId?.firstName?.toLowerCase()}
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

			<p className="text-[18px] md:text-[20px] text-gray-900 dark:text-gray-100 leading-normal break-words mb-4 whitespace-pre-wrap">
				{post.text}
			</p>

			{post.fileUp && post.fileUp.length > 0 && (
				<ImageGallery images={post.fileUp} className="mb-4 shadow-sm" />
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
