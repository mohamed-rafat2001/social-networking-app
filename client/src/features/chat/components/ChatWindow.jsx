import { useParams, useNavigate, Link } from "react-router-dom";
import { useMessages, useCreateMessage } from "../hooks/useMessageQueries";
import { useSingleChat } from "../hooks/useChatQueries";
import { useState, useEffect, useRef } from "react";
import { Avatar, Button, Spinner } from "../../../shared/components/UI";
import { useUser } from "../../../shared/hooks/useUser";
import {
	HiOutlineArrowLeft,
	HiOutlinePaperAirplane,
	HiOutlineEmojiHappy,
	HiOutlinePaperClip,
	HiOutlineX,
} from "react-icons/hi";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import InputEmoji from "react-input-emoji";

const ChatWindow = () => {
	const { chatId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useUser();
	const { socket, onlineUsers } = useSocket();
	const queryClient = useQueryClient();
	const [text, setText] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);

	const { data: chat, isLoading: chatLoading } = useSingleChat(chatId);
	const { data: messagesData, isLoading: messagesLoading } =
		useMessages(chatId);
	const messages = messagesData?.data || [];
	const { mutate: sendMessage, isLoading: isSending } = useCreateMessage();

	const otherUser = chat?.users?.find((u) => u._id !== currentUser?._id);
	const isOnline = onlineUsers?.some(
		(u) => String(u.userId) === String(otherUser?._id)
	);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (socket && chatId) {
			socket.on("getMessage", (newMessage) => {
				if (newMessage.chatId === chatId) {
					queryClient.setQueryData(["messages", chatId], (old) => {
						const oldData = old?.data || [];
						const exists = oldData.some((m) => m._id === newMessage._id);
						if (exists) return old;
						return { ...old, data: [...oldData, newMessage] };
					});
				}
			});
		}
		return () => {
			socket?.off("getMessage");
		};
	}, [socket, chatId, queryClient]);

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		if (files.length > 0) {
			setSelectedFiles((prev) => [...prev, ...files]);
			const urls = files.map((file) => URL.createObjectURL(file));
			setPreviewUrls((prev) => [...prev, ...urls]);
		}
	};

	const removeFile = (index) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
		URL.revokeObjectURL(previewUrls[index]);
		setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSend = () => {
		if (!text.trim() && selectedFiles.length === 0) return;

		const formData = new FormData();
		if (text.trim()) formData.append("content", text);
		selectedFiles.forEach((file) => {
			formData.append("file", file);
		});

		sendMessage(
			{ chatId, data: formData },
			{
				onSuccess: (response) => {
					if (socket && otherUser?._id) {
						socket.emit("sendMessage", {
							newMessage: response.data,
							userId: otherUser._id,
						});
					}
					setText("");
					setSelectedFiles([]);
					setPreviewUrls([]);
				},
			}
		);
	};

	if (chatLoading || messagesLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-white dark:bg-gray-900">
			{/* Header */}
			<div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
				<button
					onClick={() => navigate("/messages")}
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white lg:hidden"
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
						<h3 className="font-bold text-gray-900 dark:text-white leading-tight">
							{otherUser?.firstName} {otherUser?.lastName}
						</h3>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{isOnline ? "Online" : "Offline"}
						</p>
					</div>
				</Link>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages?.map((msg) => {
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
								{msg.file && msg.file.length > 0 && (
									<div className="grid grid-cols-1 gap-2">
										{msg.file.map((file, idx) => (
											<img
												key={idx}
												src={file.secure_url}
												alt="attachment"
												className="rounded-xl max-h-60 object-cover border border-gray-100 dark:border-gray-800"
											/>
										))}
									</div>
								)}
								{msg.content && (
									<div
										className={`p-3 rounded-2xl text-sm ${
											isMe
												? "bg-primary text-white rounded-tr-none shadow-sm shadow-blue-100 dark:shadow-none"
												: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
										}`}
									>
										{msg.content}
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{/* File Previews */}
			{previewUrls.length > 0 && (
				<div className="px-4 py-2 flex gap-2 overflow-x-auto bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
					{previewUrls.map((url, index) => (
						<div key={index} className="relative shrink-0">
							<img
								src={url}
								alt="preview"
								className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
							/>
							<button
								onClick={() => removeFile(index)}
								className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
							>
								<HiOutlineX size={12} />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Input */}
			<div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
				<div className="flex items-end gap-2">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="p-3 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
					>
						<HiOutlinePaperClip size={22} />
					</button>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						multiple
						accept="image/*"
						className="hidden"
					/>

					<div className="flex-1 min-h-[46px] relative">
						<InputEmoji
							value={text}
							onChange={setText}
							cleanOnEnter
							onEnter={handleSend}
							placeholder="Type a message..."
							theme="auto"
							borderRadius={12}
							fontSize={14}
							fontFamily="inherit"
						/>
					</div>

					<Button
						onClick={handleSend}
						disabled={isSending || (!text.trim() && selectedFiles.length === 0)}
						className="shrink-0 p-3 rounded-xl h-[46px] w-[46px] flex items-center justify-center"
					>
						{isSending ? (
							<Spinner size="sm" color="white" />
						) : (
							<HiOutlinePaperAirplane className="rotate-90" size={20} />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
