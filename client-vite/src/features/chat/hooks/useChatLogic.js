import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
	useMessages,
	useCreateMessage,
	useDeleteMessage,
	useUpdateMessage,
	useMarkAsRead,
} from "../hooks/useMessageQueries";
import { useSingleChat, useDeleteChat } from "../hooks/useChatQueries";
import { useUser } from "../../../shared/hooks/useUser";
import { useSocket } from "../../../shared/hooks/useSocket";

export const useChatLogic = () => {
	const { chatId } = useParams();
	const { user: currentUser } = useUser();
	const { socket, onlineUsers } = useSocket();
	const queryClient = useQueryClient();

	const [text, setText] = useState("");
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
	const [editingMessage, setEditingMessage] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false);
	const [messageToDelete, setMessageToDelete] = useState(null);

	const messagesEndRef = useRef(null);
	const previewScrollRef = useRef(null);
	const fileInputRef = useRef(null);

	const { data: chat, isLoading: chatLoading } = useSingleChat(chatId);
	const { data: messagesData, isLoading: messagesLoading } = useMessages(chatId);
	const messages = messagesData?.data || [];

	const { mutate: sendMessage, isLoading: isSending } = useCreateMessage();
	const { mutate: deleteMessage } = useDeleteMessage();
	const { mutate: updateMessage } = useUpdateMessage();
	const { mutate: deleteChat } = useDeleteChat();
	const { mutate: markAsRead } = useMarkAsRead();

	useEffect(() => {
		if (chatId) {
			markAsRead(chatId);
		}
	}, [chatId, messages?.length, markAsRead]);

	const otherUser = chat?.users?.find((u) => u._id !== currentUser?._id);
	const isOnline = onlineUsers?.some((u) => String(u.userId) === String(otherUser?._id));

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, uploadProgress, previewUrls]);

	useEffect(() => {
		if (socket && chatId) {
			socket.on("getMessage", (newMessage) => {
				queryClient.invalidateQueries(["chats"]);
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

	const handleDeleteChat = () => {
		deleteChat(chatId);
	};

	const handleDeleteMessage = () => {
		if (messageToDelete) {
			deleteMessage(messageToDelete);
			setMessageToDelete(null);
		}
	};

	const handleUpdateMessage = () => {
		if (!editContent.trim()) return;
		updateMessage(
			{ messageId: editingMessage._id, content: editContent },
			{
				onSuccess: () => {
					setEditingMessage(null);
					setEditContent("");
				},
			}
		);
	};

	const handleSend = () => {
		if (!text.trim() && selectedFiles.length === 0) return;

		const currentText = text;
		const currentFiles = [...selectedFiles];
		const currentPreviews = [...previewUrls];

		const formData = new FormData();
		if (text.trim()) formData.append("content", text);
		selectedFiles.forEach((file) => {
			formData.append("file", file);
		});

		setText("");
		setSelectedFiles([]);
		setPreviewUrls([]);
		setUploadProgress(1);

		sendMessage(
			{
				chatId,
				data: formData,
				onUploadProgress: (progress) => {
					setUploadProgress(progress);
				},
				optimisticMessage: {
					_id: `temp-${Date.now()}`,
					content: currentText,
					file: currentPreviews.map((url) => ({ secure_url: url })),
					senderId: currentUser?._id,
					sender: currentUser?._id,
					createdAt: new Date().toISOString(),
				},
			},
			{
				onSuccess: (response) => {
					if (socket && otherUser?._id) {
						socket.emit("sendMessage", {
							newMessage: response.data,
							userId: otherUser._id,
						});

						socket.emit("sendNotification", {
							recipientId: otherUser._id,
							notification: {
								_id: Date.now().toString(),
								type: "message",
								sender: currentUser,
								content: currentText || (currentFiles.length > 0 ? "Sent an attachment" : ""),
								createdAt: new Date(),
								read: false,
							},
						});
					}
					setUploadProgress(0);
				},
				onError: (error) => {
					setUploadProgress(0);
					setText(currentText);
					setSelectedFiles(currentFiles);
					setPreviewUrls(currentPreviews);
					toast.error(error.response?.data?.message || "Failed to send message");
				},
			}
		);
	};

	return {
		chatId,
		currentUser,
		otherUser,
		messages,
		chatLoading,
		messagesLoading,
		isSending,
		isOnline,
		text,
		setText,
		selectedFiles,
		setSelectedFiles,
		previewUrls,
		setPreviewUrls,
		uploadProgress,
		isPreviewModalOpen,
		setIsPreviewModalOpen,
		selectedPreviewIndex,
		setSelectedPreviewIndex,
		editingMessage,
		setEditingMessage,
		editContent,
		setEditContent,
		isDeleteChatModalOpen,
		setIsDeleteChatModalOpen,
		messageToDelete,
		setMessageToDelete,
		messagesEndRef,
		previewScrollRef,
		fileInputRef,
		handleFileSelect,
		removeFile,
		handleDeleteChat,
		handleDeleteMessage,
		handleUpdateMessage,
		handleSend,
	};
};
