import Message from "./message.model.js";
import Chat from "./chat.model.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import appError from "../../shared/utils/appError.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";

// create message
const createMessage = errorHandler(async (req, res, next) => {
	const senderId = req.user._id;
	const chatId = req.params.id;
	if (!chatId) {
		const error = appError.Error("no chat found", "fail", 404);
		return next(error);
	}

	const { content } = req.body;

	let messageData = { senderId, chatId, content };

	if (req.files && req.files.length > 0) {
		const files = [];
		for (const file of req.files) {
			const { public_id, secure_url } = await cloudinary.uploader.upload(
				file.path,
				{ folder: `social-app/chat/chatId_${chatId}` }
			);
			files.push({ public_id, secure_url });
		}
		messageData.file = files;
	}

	const message = await Message.create(messageData);

	if (!message) {
		const error = appError.Error("message not sent", "fail", 400);
		return next(error);
	}

	// Update latest message in chat
	await Chat.findByIdAndUpdate(chatId, {
		latestMessage: message._id,
	});

	res.status(200).json({ status: "success", data: message });
});

//chat messgaes
const ChatMessages = errorHandler(async (req, res, next) => {
	const chatId = req.params.id;
	const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
	
	if (!messages) {
		const error = appError.Error("messages not found", "fail", 404);
		return next(error);
	}

	// Map senderId to sender for frontend compatibility if needed
	const formattedMessages = messages.map(msg => {
		const msgObj = msg.toObject();
		msgObj.sender = msgObj.senderId;
		return msgObj;
	});

	res.status(200).json({ status: "success", data: formattedMessages });
});

const deleteMessage = errorHandler(async (req, res, next) => {
	const messageId = req.params.id;
	const message = await Message.findByIdAndDelete(messageId);
	if (!message) {
		const error = appError.Error(
			"message not deleted or not founded",
			"fail",
			404
		);
		return next(error);
	}
	res.status(200).json({ status: "success", data: message });
});

const deleteAllMessagesFromChat = errorHandler(async (req, res, next) => {
	const chatId = req.params.id;
	const senderId = req.user._id;
	const message = await Message.find({ chatId, senderId }).deleteMany();
	if (!message) {
		const error = appError.Error(
			"messages not deleted or not founded",
			"fail",
			404
		);
		return next(error);
	}
	res.status(200).json({ status: "success", data: message });
});

export {
	createMessage,
	deleteMessage,
	deleteAllMessagesFromChat,
	ChatMessages,
};
