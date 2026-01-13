import React from "react";
import { format, isToday } from "date-fns";
import {
	HiOutlineDotsVertical,
	HiOutlinePencil,
	HiOutlineTrash,
	HiCheck,
} from "react-icons/hi";
import {
	Dropdown,
	DropdownItem,
	cn,
} from "../../../../shared/components/ui";

export const MessageActions = ({
	msg,
	isMe,
	setEditingMessage,
	setEditContent,
	setMessageToDelete,
}) => {
	const formatMessageTime = (date) => {
		if (!date) return "";
		const d = new Date(date);
		return isToday(d) ? format(d, "HH:mm") : format(d, "MMM d, HH:mm");
	};

	return (
		<>
			{isMe && (
				<div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
					<Dropdown
						position="top"
						trigger={
							<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all">
								<HiOutlineDotsVertical size={16} />
							</button>
						}
					>
						<DropdownItem
							icon={HiOutlinePencil}
							onClick={() => {
								setEditingMessage(msg);
								setEditContent(msg.content || "");
							}}
						>
							Edit
						</DropdownItem>
						<DropdownItem
							variant="danger"
							icon={HiOutlineTrash}
							onClick={() => setMessageToDelete(msg._id)}
						>
							Delete
						</DropdownItem>
					</Dropdown>
				</div>
			)}

			<div
				className={cn(
					"flex items-center gap-1.5 px-1 mt-0.5",
					isMe ? "flex-row-reverse" : "flex-row"
				)}
			>
				<span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tight">
					{formatMessageTime(msg.createdAt)}
				</span>
				{isMe && (
					<div className="flex items-center">
						{msg.read ? (
							<div className="flex -space-x-1">
								<HiCheck className="text-primary" size={12} />
								<HiCheck className="text-primary" size={12} />
							</div>
						) : (
							<HiCheck
								className="text-slate-300 dark:text-slate-600"
								size={12}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};
