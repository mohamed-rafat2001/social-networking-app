import React from "react";
import { formatDistanceToNow, isToday, format } from "date-fns";
import {
	HiOutlineChatAlt2,
	HiOutlineDotsVertical,
	HiOutlinePencil,
	HiOutlineTrash,
	HiCheck,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
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
	const formatMessageTime = (date) => {
		if (!date) return "";
		const d = new Date(date);
		return isToday(d) ? format(d, "HH:mm") : format(d, "MMM d, HH:mm");
	};

	return (
		<div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
			<AnimatePresence initial={false}>
				{messages.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="h-full flex flex-col items-center justify-center text-center p-8"
					>
						<div className="w-20 h-20 bg-primary/5 dark:bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary rotate-12">
							<HiOutlineChatAlt2 size={40} />
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
							Start a conversation
						</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
							Send a message to start the conversation with{" "}
							<span className="font-semibold text-primary">
								{otherUser?.firstName} {otherUser?.lastName}
							</span>
						</p>
					</motion.div>
				) : (
					messages.map((msg, index) => {
						const isMe =
							String(msg.senderId) === String(currentUser?._id) ||
							String(msg.sender) === String(currentUser?._id);
						
						const showAvatar = index === 0 || 
							(messages[index-1] && (String(messages[index-1].senderId) !== String(msg.senderId) && String(messages[index-1].sender) !== String(msg.sender)));

						return (
							<motion.div
								key={msg._id}
								initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								layout
								className={cn(
									"flex w-full mb-1",
									isMe ? "justify-end" : "justify-start"
								)}
							>
								<div
									className={cn(
										"flex items-end gap-2 max-w-[85%] sm:max-w-[70%]",
										isMe ? "flex-row-reverse" : "flex-row"
									)}
								>
									<div
										className={cn(
											"flex flex-col gap-1",
											isMe ? "items-end" : "items-start"
										)}
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
															"w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] overflow-hidden rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800",
															isMe ? "rounded-tr-none" : "rounded-tl-none"
														)}
													>
														<ImageGallery images={msg.file} />
													</div>
												)}
												{msg.content && (
													<div
														className={cn(
															"px-4 py-2.5 rounded-2xl text-[14.5px] leading-relaxed shadow-sm",
															isMe
																? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-none"
																: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50"
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
										</div>

										<div className={cn(
											"flex items-center gap-1.5 px-1 mt-0.5",
											isMe ? "flex-row-reverse" : "flex-row"
										)}>
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
														<HiCheck className="text-slate-300 dark:text-slate-600" size={12} />
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						);
					})
				)}
			</AnimatePresence>
			<div ref={messagesEndRef} className="h-4" />
		</div>
	);
};

export default ChatMessageList;
