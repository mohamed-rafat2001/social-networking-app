import { useParams } from "react-router-dom";
import {
	useMessages,
	useCreateMessage,
	useDeleteMessage,
	useUpdateMessage,
} from "../hooks/useMessageQueries";
import { useSingleChat, useDeleteChat } from "../hooks/useChatQueries";
import { useState, useEffect, useRef } from "react";
import { Spinner, ConfirmModal } from "../../../shared/components/ui";
import { useUser } from "../../../shared/hooks/useUser";
import { useTheme } from "../../../providers/ThemeProvider";
import { useSocket } from "../../../shared/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import ChatHeader from "./detail/ChatHeader";
import ChatMessageList from "./detail/ChatMessageList";
import ChatFilePreview from "./detail/ChatFilePreview";
import ChatUploadProgress from "./detail/ChatUploadProgress";
import ChatInput from "./detail/ChatInput";
import EditMessageModal from "./detail/EditMessageModal";

const ChatWindow = () => {
	const { chatId } = useParams();
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

	const [editingMessage, setEditingMessage] = useState(null);
	const [editContent, setEditContent] = useState("");
	const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false);
	const [messageToDelete, setMessageToDelete] = useState(null);

	const { data: chat, isLoading: chatLoading } = useSingleChat(chatId);
	const { data: messagesData, isLoading: messagesLoading } =
		useMessages(chatId);
	const messages = messagesData?.data || [];
	const { mutate: sendMessage, isLoading: isSending } = useCreateMessage();
	const { mutate: deleteMessage } = useDeleteMessage();
	const { mutate: updateMessage } = useUpdateMessage();
	const { mutate: deleteChat } = useDeleteChat();

	const otherUser = chat?.users?.find((u) => u._id !== currentUser?._id);

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

	const handleSend = () => {
		if (!text.trim() && selectedFiles.length === 0) return;

		const formData = new FormData();
		if (text.trim()) formData.append("content", text);
		selectedFiles.forEach((file) => {
			formData.append("file", file);
		});

		setUploadProgress(1);

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
			<ChatHeader
				otherUser={otherUser}
				isOnline={isOnline}
				setIsDeleteChatModalOpen={setIsDeleteChatModalOpen}
			/>

			<ChatMessageList
				messages={messages}
				currentUser={currentUser}
				otherUser={otherUser}
				setEditingMessage={setEditingMessage}
				setEditContent={setEditContent}
				setMessageToDelete={setMessageToDelete}
				messagesEndRef={messagesEndRef}
			/>

			<ConfirmModal
				isOpen={isDeleteChatModalOpen}
				onClose={() => setIsDeleteChatModalOpen(false)}
				onConfirm={handleDeleteChat}
				title="Delete Chat"
				message="Are you sure you want to delete this entire chat? This action cannot be undone."
			/>

			<ConfirmModal
				isOpen={!!messageToDelete}
				onClose={() => setMessageToDelete(null)}
				onConfirm={handleDeleteMessage}
				title="Delete Message"
				message="Are you sure you want to delete this message? This action cannot be undone."
			/>

			<ChatFilePreview
				previewUrls={previewUrls}
				setPreviewUrls={setPreviewUrls}
				setSelectedFiles={setSelectedFiles}
				setSelectedPreviewIndex={setSelectedPreviewIndex}
				setIsPreviewModalOpen={setIsPreviewModalOpen}
				removeFile={removeFile}
				previewScrollRef={previewScrollRef}
				isPreviewModalOpen={isPreviewModalOpen}
				selectedPreviewIndex={selectedPreviewIndex}
			/>

			<ChatUploadProgress uploadProgress={uploadProgress} />

			<ChatInput
				text={text}
				setText={setText}
				handleSend={handleSend}
				handleFileSelect={handleFileSelect}
				fileInputRef={fileInputRef}
				isSending={isSending}
				selectedFiles={selectedFiles}
				darkMode={darkMode}
			/>

			<EditMessageModal
				editingMessage={editingMessage}
				setEditingMessage={setEditingMessage}
				editContent={editContent}
				setEditContent={setEditContent}
				handleUpdateMessage={handleUpdateMessage}
			/>
		</div>
	);
};

export default ChatWindow;
