import Chat from "./chat.model.js";
import User from "../auth/user.model.js";
import appError from "../../shared/utils/appError.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";

//create chat
const createChat = errorHandler(async (req, res, next) => {
	const userId = req.user._id;
	const secondId = req.body.secondId;

	if (!secondId) {
		const error = appError.Error("secondId is required", "fail", 400);
		return next(error);
	}

	const findSecondId = await User.findById(secondId);
	if (!findSecondId) {
		const error = appError.Error("user not found", "fail", 404);
		return next(error);
	}

	// Find chat between these two users
	let chat = await Chat.findOne({
		members: { $all: [userId, secondId] },
	}).populate("members", "firstName lastName image username");

	if (chat) {
		// Map members to users for frontend compatibility
		const chatObj = chat.toObject();
		chatObj.users = chatObj.members;
		return res.status(200).json({ status: "success", data: chatObj });
	}

	chat = await Chat.create({
		members: [userId, secondId],
	});

	await chat.populate("members", "firstName lastName image username");

	const chatObj = chat.toObject();
	chatObj.users = chatObj.members;

	res.status(200).json({ status: "success", data: chatObj });
});

const findChat = errorHandler(async (req, res, next) => {
	const _id = req.params.id;
	const chat = await Chat.findById(_id).populate("members", "firstName lastName image username");
	
	if (!chat) {
		const error = appError.Error("chat not found", "fail", 404);
		return next(error);
	}

	const chatObj = chat.toObject();
	chatObj.users = chatObj.members;

	res.status(200).json({ status: "success", data: chatObj });
});

const findUserChats = errorHandler(async (req, res, next) => {
	const userId = req.user._id;
	const chats = await Chat.find({
		members: { $in: [userId] },
	})
	.populate("members", "firstName lastName image username")
	.populate({
		path: "latestMessage",
		select: "text senderId createdAt"
	})
	.sort({ updatedAt: -1 });

	if (!chats) {
		const error = appError.Error("chats not found", "fail", 404);
		return next(error);
	}

	const formattedChats = chats.map(chat => {
		const chatObj = chat.toObject();
		chatObj.users = chatObj.members;
		return chatObj;
	});

	res.status(200).json({ status: "success", data: formattedChats });
});

const deleteChat = errorHandler(async (req, res, next) => {
	const chatId = req.params.id;
	const chat = await Chat.findByIdAndDelete(chatId);
	if (!chat) {
		const error = appError.Error("chat not found", "fail", 404);
		return next(error);
	}

	res.status(200).json({ status: "success", data: chat });
});

export { createChat, findChat, findUserChats, deleteChat };
