import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { HiDotsVertical, HiOutlineTrash, HiCheck, HiCheckCircle } from "react-icons/hi";
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

	const isLastMessageFromMe =
		lastMessage &&
		String(lastMessage.sender || lastMessage.senderId) === String(currentUser?._id);

	return (
		<Link
			to={`/messages/${chat._id}`}
			className={cn(
				"flex items-center gap-3 p-3 mx-2 my-1 rounded-2xl transition-all duration-300 relative group",
				isActive
					? "bg-primary/10 dark:bg-primary/20 shadow-sm"
					: "hover:bg-slate-50 dark:hover:bg-white/5"
			)}
		>
			{isActive && (
				<motion.div
					layoutId="activeIndicator"
					className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full"
				/>
			)}

			<div className="relative shrink-0">
				<Avatar
					src={otherUser?.image?.secure_url}
					size="lg"
					className={cn(
						"ring-2 ring-offset-2 ring-transparent transition-all duration-300 dark:ring-offset-slate-950",
						isActive ? "ring-primary/20 scale-105" : "group-hover:scale-105"
					)}
				/>
				{isOnline && (
					<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
				)}
			</div>

			<div className="flex-1 min-w-0 py-1">
				<div className="flex justify-between items-center mb-1">
					<h4
						className={cn(
							"font-bold truncate text-[15px] transition-colors",
							isActive ? "text-primary" : "text-slate-900 dark:text-white"
						)}
					>
						{otherUser?.firstName} {otherUser?.lastName}
					</h4>

					<div className="flex items-center gap-2 shrink-0">
						{lastMessage && (
							<span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
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
									<button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
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
					<div className="flex items-center gap-1.5 flex-1 min-w-0">
						{isLastMessageFromMe && (
							<div className="shrink-0">
								{lastMessage.read ? (
									<div className="flex -space-x-1">
										<HiCheck className="text-primary" size={12} />
										<HiCheck className="text-primary" size={12} />
									</div>
								) : (
									<HiCheck className="text-slate-300 dark:text-slate-600" size={12} />
								)}
							</div>
						)}
						<p
							className={cn(
								"text-[13px] truncate",
								chat.unreadCount > 0
									? "text-slate-900 dark:text-white font-bold"
									: "text-slate-500 dark:text-slate-400 font-medium"
							)}
						>
							{lastMessage ? (
								<>
									{lastMessage.content ||
										(lastMessage.file?.length > 0
											? "Shared images"
											: "No messages yet")}
								</>
							) : (
								"No messages yet"
							)}
						</p>
					</div>

					{chat.unreadCount > 0 && (
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-primary/30"
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
