import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	HiOutlineArrowLeft,
	HiOutlineDotsVertical,
	HiOutlineTrash,
} from "react-icons/hi";
import { motion } from "framer-motion";
import {
	Avatar,
	Dropdown,
	DropdownItem,
} from "../../../../shared/components/ui";

const ChatHeader = ({ otherUser, isOnline, setIsDeleteChatModalOpen }) => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
			<button
				onClick={() => navigate("/messages")}
				className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-900 dark:text-white lg:hidden"
			>
				<HiOutlineArrowLeft size={20} />
			</button>
			<Link
				to={`/profile/${otherUser?._id}`}
				className="flex items-center gap-3 group"
			>
				<div className="relative">
					<Avatar
						src={otherUser?.image?.secure_url}
						size="md"
						className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
					/>
					{isOnline && (
						<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full">
							<span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
						</span>
					)}
				</div>
				<div>
					<h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
						{otherUser?.firstName} {otherUser?.lastName}
					</h3>
					<div className="flex items-center gap-1.5">
						{isOnline ? (
							<>
								<span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
								<p className="text-[11px] font-medium text-green-500 uppercase tracking-wider">
									Active Now
								</p>
							</>
						) : (
							<p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
								Offline
							</p>
						)}
					</div>
				</div>
			</Link>

			<div className="ml-auto flex items-center gap-1">
				<Dropdown
					trigger={
						<button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer">
							<HiOutlineDotsVertical size={20} />
						</button>
					}
				>
					<DropdownItem
						variant="danger"
						icon={HiOutlineTrash}
						onClick={() => setIsDeleteChatModalOpen(true)}
					>
						Delete Chat
					</DropdownItem>
				</Dropdown>
			</div>
		</div>
	);
};

export default ChatHeader;
