import { useParams, useNavigate } from "react-router-dom";
import { useMessages, useCreateMessage } from "../hooks/useMessageQueries";
import { useSingleChat } from "../hooks/useChatQueries";
import { useState, useEffect, useRef } from "react";
import { Avatar, Button, Spinner } from "../../../ui";
import { useUser } from "../../../hooks/useUser";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from "react-icons/hi";
import { useSocket } from "../../../providers/SocketProvider";

const ChatWindow = () => {
	const { chatId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useUser();
	const { socket, onlineUsers } = useSocket();
	const [text, setText] = useState("");
	const messagesEndRef = useRef(null);

	const { data: chat, isLoading: chatLoading } = useSingleChat(chatId);
	const { data: messages, isLoading: messagesLoading } = useMessages(chatId);
	const { mutate: sendMessage } = useCreateMessage();

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

	const handleSend = (e) => {
		e.preventDefault();
		if (!text.trim()) return;

		sendMessage({ chatId, data: { content: text } });
		setText("");
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
					className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-900 dark:text-white"
				>
					<HiOutlineArrowLeft size={20} />
				</button>
				<Avatar
					src={otherUser?.image?.secure_url}
					size="md"
					isActive={isOnline}
				/>
				<div className="flex-1 min-w-0">
					<h4 className="font-bold text-gray-900 dark:text-white truncate">
						{otherUser?.firstName} {otherUser?.lastName}
					</h4>
				</div>
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
								className={`max-w-[70%] p-3 rounded-2xl text-sm ${
									isMe
										? "bg-primary text-white rounded-tr-none shadow-sm shadow-blue-100 dark:shadow-none"
										: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
								}`}
							>
								{msg.content}
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<form
				onSubmit={handleSend}
				className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
			>
				<div className="flex gap-2">
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all dark:text-white dark:placeholder-gray-500"
					/>
					<Button type="submit" className="shrink-0 p-3 rounded-xl">
						<HiOutlinePaperAirplane className="rotate-90" size={20} />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatWindow;
