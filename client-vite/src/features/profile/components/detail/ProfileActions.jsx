import React from "react";
import { HiOutlineChatAlt2, HiUserAdd, HiUserRemove, HiDotsHorizontal } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
import { Button, Spinner, Dropdown, DropdownItem, cn } from "../../../../shared/components/ui";

const ProfileActions = ({
	isCurrentUser,
	isFollowing,
	isBlocked,
	isCreatingChat,
	handleMessage,
	handleFollowToggle,
	handleBlockToggle,
}) => {
	if (isCurrentUser) return null;

	return (
		<div className="flex items-center gap-3">
			<Button
				variant="secondary"
				className="rounded-full flex items-center gap-2 px-4 h-9 text-sm font-black shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-lg transition-all duration-300 border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
				onClick={handleMessage}
				disabled={isCreatingChat}
			>
				{isCreatingChat ? (
					<Spinner size="sm" />
				) : (
					<>
						<HiOutlineChatAlt2 size={18} />
						<span className="hidden sm:inline">Message</span>
					</>
				)}
			</Button>
			<Button
				className={cn(
					"rounded-full flex items-center gap-2 px-5 h-9 text-sm font-black shadow-md transition-all duration-300 cursor-pointer",
					isFollowing
						? "bg-red-100 text-red-600 hover:bg-red-200 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-800 shadow-red-200/50 dark:shadow-none"
						: "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
				)}
				onClick={handleFollowToggle}
			>
				{isFollowing ? (
					<>
						<HiUserRemove size={18} />
						<span>Unfollow</span>
					</>
				) : (
					<>
						<HiUserAdd size={18} />
						<span>Follow</span>
					</>
				)}
			</Button>

			<Dropdown
				align="right"
				trigger={
					<button className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md flex items-center justify-center cursor-pointer shrink-0">
						<HiDotsHorizontal size={20} />
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
	);
};

export default ProfileActions;
