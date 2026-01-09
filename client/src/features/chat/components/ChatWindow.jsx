import { useParams, useNavigate, Link } from "react-router-dom";
import { useMessages, useCreateMessage } from "../hooks/useMessageQueries";
import { useSingleChat } from "../hooks/useChatQueries";
import { useState, useEffect, useRef } from "react";
import {
	Avatar,
	Button,
	Spinner,
	ImageGallery,
	cn,
	ImageModal,
} from "../../../shared/components/UI";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
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
import { motion, AnimatePresence } from "framer-motion";

const ChatWindow = () => {
	const { chatId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useUser();
	const { darkMode } = useTheme();
	const { socket, onlineUsers } = useSocket();
	const queryClient = useQueryClient();
	const [text, setText] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
	const messagesEndRef = useRef(null);
	const previewScrollRef = useRef(null);
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
	}, [messages, uploadProgress, previewUrls]);

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

	useEffect(() => {
		if (previewUrls.length > 0 && previewScrollRef.current) {
			previewScrollRef.current.scrollTo({
				left: previewScrollRef.current.scrollWidth,
				behavior: "smooth",
			});
		}
	}, [previewUrls.length]);

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

		setUploadProgress(1); // Start showing progress

		sendMessage(
			{
				chatId,
				data: formData,
				onUploadProgress: (progress) => {
					setUploadProgress(progress);
				},
			},
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
					setUploadProgress(0);
				},
				onError: () => {
					setUploadProgress(0);
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
									<div
										className={cn(
											"w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px]",
											isMe ? "ml-auto" : "mr-auto"
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
				<div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
					<div className="flex items-center justify-between mb-2">
						<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
							{previewUrls.length} image{previewUrls.length > 1 ? "s" : ""}{" "}
							selected
						</span>
						<button
							onClick={() => {
								previewUrls.forEach((url) => URL.revokeObjectURL(url));
								setPreviewUrls([]);
								setSelectedFiles([]);
							}}
							className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
						>
							Clear all
						</button>
					</div>
					<div
						ref={previewScrollRef}
						className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
					>
						<AnimatePresence>
							{previewUrls.map((url, index) => (
								<motion.div
									key={url}
									initial={{ opacity: 0, scale: 0.8, x: -20 }}
									animate={{ opacity: 1, scale: 1, x: 0 }}
									exit={{ opacity: 0, scale: 0.8, x: -20 }}
									className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer group shadow-sm"
									onClick={() => {
										setSelectedPreviewIndex(index);
										setIsPreviewModalOpen(true);
									}}
								>
									<img
										src={url}
										alt="preview"
										className="w-full h-full object-cover transition-transform group-hover:scale-110"
									/>
									<button
										onClick={(e) => {
											e.stopPropagation();
											removeFile(index);
										}}
										className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
									>
										<HiOutlineX size={12} />
									</button>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
								</motion.div>
							))}
						</AnimatePresence>
					</div>
					<ImageModal
						isOpen={isPreviewModalOpen}
						onClose={() => setIsPreviewModalOpen(false)}
						images={previewUrls}
						initialIndex={selectedPreviewIndex}
					/>
				</div>
			)}

			{/* Upload Progress */}
			<AnimatePresence>
				{uploadProgress > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
					>
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-between mb-1">
								<span className="text-[10px] font-bold text-primary uppercase tracking-wider">
									{uploadProgress === 100 ? "Processing..." : "Uploading..."}
								</span>
								<span className="text-[10px] font-bold text-primary">
									{uploadProgress}%
								</span>
							</div>
							<div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${uploadProgress}%` }}
									transition={{ type: "spring", damping: 20, stiffness: 100 }}
									className="h-full bg-primary"
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

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
							theme={darkMode ? "dark" : "light"}
							background={darkMode ? "#1f2937" : "#f9fafb"}
							color={darkMode ? "#f3f4f6" : "#1f2937"}
							placeholderColor={darkMode ? "#9ca3af" : "#6b7280"}
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
