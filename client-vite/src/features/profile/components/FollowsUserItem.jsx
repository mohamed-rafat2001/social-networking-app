import React from "react";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import { Avatar, Button, cn } from "../../../shared/components/ui";

const FollowsUserItem = ({
	user,
	isMe,
	following,
	onUserClick,
	onFollowToggle,
}) => {
	return (
		<div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all group">
			<div
				className="flex items-center gap-3 cursor-pointer flex-1"
				onClick={() => onUserClick(user._id)}
			>
				<Avatar src={user.image?.secure_url} size="md" />
				<div className="min-w-0">
					<p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
						{user.firstName} {user.lastName}
					</p>
					<p className="text-xs text-slate-500 dark:text-slate-400 truncate">
						@{user.username}
					</p>
				</div>
			</div>
			{!isMe && (
				<div className="flex items-center gap-2">
					<Button
						variant={following ? "outline" : "primary"}
						size="sm"
						className={cn(
							"rounded-xl h-9 px-4 font-bold transition-all",
							following
								? "bg-red-50 text-red-600 hover:bg-red-100 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20"
								: ""
						)}
						onClick={() => onFollowToggle(user._id)}
					>
						{following ? (
							<span className="flex items-center gap-1">
								<HiUserRemove size={16} />
								Unfollow
							</span>
						) : (
							<span className="flex items-center gap-1">
								<HiUserAdd size={16} />
								Follow
							</span>
						)}
					</Button>
				</div>
			)}
		</div>
	);
};

export default FollowsUserItem;
