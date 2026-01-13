import React from "react";
import { Spinner } from "../../../shared/components/ui";
import { useTheme } from "../../../providers/ThemeProvider";
import { useChatLogic } from "../hooks/useChatLogic";
import ChatHeader from "./detail/ChatHeader";
import ChatMessageList from "./detail/ChatMessageList";
import ChatFilePreview from "./detail/ChatFilePreview";
import ChatUploadProgress from "./detail/ChatUploadProgress";
import ChatInput from "./detail/ChatInput";
import ChatModals from "./ChatModals";

const ChatWindow = () => {
	const { darkMode } = useTheme();
	const {
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
	} = useChatLogic();



	if (chatLoading || messagesLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-white dark:bg-slate-950">
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

			<ChatModals
				isDeleteChatModalOpen={isDeleteChatModalOpen}
				setIsDeleteChatModalOpen={setIsDeleteChatModalOpen}
				handleDeleteChat={handleDeleteChat}
				messageToDelete={messageToDelete}
				setMessageToDelete={setMessageToDelete}
				handleDeleteMessage={handleDeleteMessage}
				editingMessage={editingMessage}
				setEditingMessage={setEditingMessage}
				editContent={editContent}
				setEditContent={setEditContent}
				handleUpdateMessage={handleUpdateMessage}
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


		</div>
	);
};

export default ChatWindow;
