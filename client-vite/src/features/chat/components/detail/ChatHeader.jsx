import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	HiOutlineArrowLeft,
	HiOutlineDotsVertical,
	HiOutlineTrash,
} from "react-icons/hi";
import {
	Avatar,
	Dropdown,
	DropdownItem,
} from "../../../../shared/components/ui";

const ChatHeader = ({ otherUser, isOnline, setIsDeleteChatModalOpen }) => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
			<button
				onClick={() => navigate("/messages")}
				className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-900 dark:text-white lg:hidden"
			>
				<HiOutlineArrowLeft size={20} />
			</button>
			<Link
				to={`/profile/${otherUser?._id}`}
				className="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<Avatar
					src={otherUser?.image?.secure_url}
					size="md"
					isActive={isOnline}
				/>
				<div>
					<h3 className="font-bold text-slate-900 dark:text-white leading-tight">
						{otherUser?.firstName} {otherUser?.lastName}
					</h3>
					<p className="text-xs text-slate-500 dark:text-slate-400">
						{isOnline ? "Online" : "Offline"}
					</p>
				</div>
			</Link>

			<div className="ml-auto">
				<Dropdown
					trigger={
						<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
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
