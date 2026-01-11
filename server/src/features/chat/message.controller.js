import Message from "./message.model.js";
import Chat from "./chat.model.js";
import { cloudinary } from "../../shared/utils/cloudinary.js";
import { AppError } from "../../shared/utils/appError.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";
import * as factory from "../../shared/utils/handlerFactory.js";
import { createNotification } from "../notifications/notification.controller.js";

const createMessage = catchAsync(async (req, res, next) => {
	const senderId = req.user._id;
	const chatId = req.params.id;
	if (!chatId) {
		const error = new AppError("no chat found", "fail", 404);
		return next(error);
	}

	const { content } = req.body;

	let messageData = { senderId, chatId, content };

	if (req.files && req.files.length > 0) {
		const uploadPromises = req.files.map((file) =>
			cloudinary.uploader.upload(file.path, {
				folder: `social-app/chat/chatId_${chatId}`,
				resource_type: "auto",
			})
		);

		try {
			const uploadResults = await Promise.all(uploadPromises);
			const files = uploadResults.map((result) => ({
				public_id: result.public_id,
				secure_url: result.secure_url,
			}));
			messageData.file = files;
		} catch (uploadError) {
			console.error("Cloudinary upload error in chat:", uploadError);
			const error = new AppError(
				`Failed to upload chat files: ${uploadError.message}`,
				"fail",
				500
			);
			return next(error);
		}
	}

	const message = await Message.create(messageData);

	if (!message) {
		const error = new AppError("message not sent", "fail", 400);
		return next(error);
	}

	// Update latest message in chat
	const chat = await Chat.findByIdAndUpdate(chatId, {
		latestMessage: message._id,
	});

	// Create notification for the recipient
	const recipientId = chat.members.find(
		(memberId) => memberId.toString() !== senderId.toString()
	);

	if (recipientId) {
		await createNotification({
			recipient: recipientId,
			sender: senderId,
			type: "message",
			content: content || "Sent an attachment",
		});
	}

	res.status(200).json({ status: "success", data: message });
});

//chat messgaes
const ChatMessages = catchAsync(async (req, res, next) => {
	const chatId = req.params.id;
	const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
	res
		.status(200)
		.json({ status: "success", results: messages.length, data: messages });
});

const deleteMessage = catchAsync(async (req, res, next) => {
	const messageId = req.params.id;
	const userId = req.user._id;

	const message = await Message.findOne({ _id: messageId, senderId: userId });

	if (!message) {
		const error = new AppError(
			"Message not found or you don't have permission to delete it",
			"fail",
			404
		);
		return next(error);
	}

	// Delete from Cloudinary if there are files
	if (message.file && message.file.length > 0) {
		const deletePromises = message.file.map((file) =>
			cloudinary.uploader.destroy(file.public_id)
		);
		await Promise.all(deletePromises);
	}

	const chatId = message.chatId;
	await message.deleteOne();

	// Update latest message in chat
	const latestMessage = await Message.findOne({ chatId }).sort({
		createdAt: -1,
	});
	await Chat.findByIdAndUpdate(chatId, {
		latestMessage: latestMessage ? latestMessage._id : null,
	});

	res
		.status(200)
		.json({ status: "success", message: "Message deleted successfully" });
});

const updateMessage = factory.updateOneByOwner(Message, "senderId");

const markMessagesAsRead = catchAsync(async (req, res, next) => {
	const chatId = req.params.id;
	const userId = req.user._id;

	await Message.updateMany(
		{ chatId, senderId: { $ne: userId }, read: false },
		{ read: true }
	);

	res
		.status(200)
		.json({ status: "success", message: "Messages marked as read" });
});

const deleteAllMessagesFromChat = catchAsync(async (req, res, next) => {
	const chatId = req.params.id;
	const senderId = req.user._id;
	const message = await Message.find({ chatId, senderId }).deleteMany();
	if (!message) {
		const error = new AppError(
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
	updateMessage,
	markMessagesAsRead,
	deleteAllMessagesFromChat,
	ChatMessages,
};
