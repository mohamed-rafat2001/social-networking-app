import React from "react";
import {
	Avatar,
	Button,
	cn,
	Dropdown,
	DropdownItem,
	Spinner,
} from "../../../../shared/components/ui";
import {
	HiOutlinePencil,
	HiOutlineTrash,
	HiOutlineChatAlt2,
	HiUserAdd,
	HiUserRemove,
	HiDotsHorizontal,
} from "react-icons/hi";
import { MdBlock } from "react-icons/md";

const ProfileHeader = ({
	user,
	isCurrentUser,
	isFollowing,
	isBlocked,
	onlineUsers,
	isCreatingChat,
	handleMessage,
	handleFollowToggle,
	handleBlockToggle,
	setIsUploadModalOpen,
	setIsDeleteModalOpen,
}) => {
	return (
		<>
			<div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
				<div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left] dark:bg-grid-slate-100/[0.02]"></div>
			</div>
			<div className="px-6 md:px-8 pb-8">
				<div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 mb-8 gap-6">
					<div className="relative group">
						{isCurrentUser ? (
							<Dropdown
								trigger={
									<div className="cursor-pointer relative">
										<Avatar
											src={user.image?.secure_url}
											size="2xl"
											className="ring-[6px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
											isActive={onlineUsers?.some(
												(u) => String(u.userId) === String(user._id)
											)}
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ring-[6px] ring-white dark:ring-slate-900">
											<HiOutlinePencil className="text-white" size={28} />
										</div>
									</div>
								}
								align="left"
							>
								<DropdownItem
									icon={HiOutlinePencil}
									onClick={() => setIsUploadModalOpen(true)}
								>
									Upload Photo
								</DropdownItem>
								{user.image?.secure_url && (
									<DropdownItem
										icon={HiOutlineTrash}
										variant="danger"
										onClick={() => setIsDeleteModalOpen(true)}
									>
										Delete Photo
									</DropdownItem>
								)}
							</Dropdown>
						) : (
							<Avatar
								src={user.image?.secure_url}
								size="2xl"
								className="ring-[6px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-300 group-hover:scale-105"
								isActive={onlineUsers?.some(
									(u) => String(u.userId) === String(user._id)
								)}
							/>
						)}
					</div>

					<div className="flex flex-col md:flex-row items-center gap-6">
						{!isCurrentUser && (
							<div className="flex items-center gap-3">
								<Button
									variant="secondary"
									className="rounded-full flex items-center gap-2 px-6 h-11 font-black shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-lg transition-all duration-300 border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
									onClick={handleMessage}
									disabled={isCreatingChat}
								>
									{isCreatingChat ? (
										<Spinner size="sm" />
									) : (
										<>
											<HiOutlineChatAlt2 size={20} />
											<span className="hidden sm:inline">Message</span>
										</>
									)}
								</Button>
								<Button
									className={cn(
										"rounded-full flex items-center gap-2 px-8 h-11 font-black shadow-md transition-all duration-300 cursor-pointer",
										isFollowing
											? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-800 shadow-red-200/50 dark:shadow-none"
											: "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
									)}
									onClick={handleFollowToggle}
								>
									{isFollowing ? (
										<>
											<HiUserRemove size={20} />
											<span>Unfollow</span>
										</>
									) : (
										<>
											<HiUserAdd size={20} />
											<span>Follow</span>
										</>
									)}
								</Button>

								<Dropdown
									align="right"
									trigger={
										<button className="w-11 h-11 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer shrink-0">
											<HiDotsHorizontal size={22} />
										</button>
									}
								>
									<DropdownItem
										icon={MdBlock}
										variant={isBlocked ? "default" : "danger"}
										onClick={handleBlockToggle}
									>
										{isBlocked ? "Unblock User" : "Block User"}
									</DropdownItem>
								</Dropdown>
							</div>
						)}
					</div>
				</div>
				{/* User Info Title */}
				<div className="text-center md:text-left">
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
						<h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
							{user.firstName} {user.lastName}
						</h1>
						<span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-600 uppercase tracking-widest w-fit">
							{user.userType}
						</span>
					</div>
					<p className="text-xl text-blue-600 font-black tracking-tight">
						@{user.username}
					</p>
				</div>
			</div>
		</>
	);
};

export default ProfileHeader;
