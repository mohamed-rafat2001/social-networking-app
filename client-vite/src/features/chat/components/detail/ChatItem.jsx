import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { HiDotsVertical, HiOutlineTrash } from "react-icons/hi";
import {
	Avatar,
	Dropdown,
	DropdownItem,
	cn,
} from "../../../../shared/components/ui";

const ChatItem = ({
	chat,
	currentUser,
	activeChatId,
	onlineUsers,
	setChatToDelete,
}) => {
	const otherUser = chat.users.find((u) => u._id !== currentUser?._id);
	const lastMessage = chat.latestMessage;
	const isActive = chat._id === activeChatId;
	const isOnline = onlineUsers?.some(
		(u) => String(u.userId) === String(otherUser?._id)
	);

	return (
		<Link
			to={`/messages/${chat._id}`}
			className={cn(
				"flex items-center gap-3 p-3 mx-2 my-1 rounded-2xl transition-all duration-200 relative group",
				isActive
					? "bg-primary/10 dark:bg-primary/20 shadow-sm"
					: "hover:bg-gray-50 dark:hover:bg-white/5"
			)}
		>
			<div className="relative shrink-0">
				<Avatar
					src={otherUser?.image?.secure_url}
					size="lg"
					className={cn(
						"ring-2 ring-transparent transition-all",
						isActive ? "ring-primary/20" : ""
					)}
				/>
				{isOnline && (
					<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
				)}
			</div>

			<div className="flex-1 min-w-0 py-1">
				<div className="flex justify-between items-center mb-0.5">
					<h4
						className={cn(
							"font-bold truncate text-[15px]",
							isActive ? "text-primary" : "text-gray-900 dark:text-white"
						)}
					>
						{otherUser?.firstName} {otherUser?.lastName}
					</h4>

					<div className="flex items-center gap-2 shrink-0">
						{lastMessage && (
							<span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
								{lastMessage.createdAt &&
								!isNaN(new Date(lastMessage.createdAt).getTime())
									? formatDistanceToNow(new Date(lastMessage.createdAt), {
											addSuffix: false,
									  })
									: "now"}
							</span>
						)}
						<div
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							className="opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
						>
							<Dropdown
								trigger={
									<button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
										<HiDotsVertical size={14} />
									</button>
								}
							>
								<DropdownItem
									variant="danger"
									icon={HiOutlineTrash}
									onClick={() => setChatToDelete(chat._id)}
								>
									Delete Chat
								</DropdownItem>
							</Dropdown>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between gap-2">
					<p
						className={cn(
							"text-sm truncate flex-1",
							chat.unreadCount > 0
								? "text-slate-900 dark:text-white font-semibold"
								: "text-slate-500 dark:text-slate-400"
						)}
					>
						{lastMessage ? (
							<>
								{String(lastMessage.sender || lastMessage.senderId) ===
									String(currentUser?._id) && (
									<span className="text-slate-400 dark:text-slate-500 font-normal">
										You:{" "}
									</span>
								)}
								{lastMessage.content ||
									(lastMessage.file?.length > 0
										? "Shared images"
										: "No messages yet")}
							</>
						) : (
							"No messages yet"
						)}
					</p>

					{chat.unreadCount > 0 && (
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
						>
							{chat.unreadCount}
						</motion.div>
					)}
				</div>
			</div>
		</Link>
	);
};

export default ChatItem;
