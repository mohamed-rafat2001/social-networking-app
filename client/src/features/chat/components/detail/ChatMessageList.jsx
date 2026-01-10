import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
	HiOutlineChatAlt2,
	HiOutlineDotsVertical,
	HiOutlinePencil,
	HiOutlineTrash,
} from "react-icons/hi";
import {
	ImageGallery,
	Dropdown,
	DropdownItem,
	cn,
} from "../../../../shared/components/ui";

const ChatMessageList = ({
	messages,
	currentUser,
	otherUser,
	setEditingMessage,
	setEditContent,
	setMessageToDelete,
	messagesEndRef,
}) => {
	return (
		<div className="flex-1 overflow-y-auto p-4 space-y-4">
			{messages.length === 0 ? (
				<div className="h-full flex flex-col items-center justify-center text-center p-8">
					<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
						<HiOutlineChatAlt2 size={32} />
					</div>
					<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
						No messages yet
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px]">
						Send a message to start the conversation with {otherUser?.firstName}
					</p>
				</div>
			) : (
				messages.map((msg) => {
					const isMe = msg.sender === currentUser?._id;
					return (
						<div
							key={msg._id}
							className={`flex ${isMe ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[70%] space-y-2 ${
									isMe ? "flex flex-col items-end" : "flex flex-col items-start"
								}`}
							>
								<div
									className={cn(
										"group relative flex items-center gap-2",
										isMe ? "flex-row-reverse" : "flex-row"
									)}
								>
									<div
										className={cn(
											"flex flex-col gap-2",
											isMe ? "items-end" : "items-start"
										)}
									>
										{msg.file && msg.file.length > 0 && (
											<div
												className={cn(
													"w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px]"
												)}
											>
												<ImageGallery
													images={msg.file}
													className={cn(
														"shadow-sm",
														isMe ? "rounded-tr-none" : "rounded-tl-none"
													)}
												/>
											</div>
										)}
										{msg.content && (
											<div
												className={cn(
													"p-3 rounded-2xl text-sm",
													isMe
														? "bg-primary text-white rounded-tr-none shadow-sm shadow-blue-100 dark:shadow-none"
														: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
												)}
											>
												{msg.content}
											</div>
										)}
									</div>

									{isMe && (
										<div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
											<Dropdown
												position="top"
												trigger={
													<button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
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
								</div>

								<span className="text-[10px] text-gray-400 mt-1 px-1">
									{msg.createdAt &&
										formatDistanceToNow(new Date(msg.createdAt), {
											addSuffix: true,
										})}
								</span>
							</div>
						</div>
					);
				})
			)}
			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatMessageList;
