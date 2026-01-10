import Notification from "./notification.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import * as factory from "../../shared/utils/handlerFactory.js";

const getNotifications = errorHandler(async (req, res, next) => {
	const notifications = await Notification.find({ recipient: req.user._id })
		.populate("sender", "firstName lastName image")
		.populate("post", "content")
		.sort({ createdAt: -1 });

	res.status(200).json({
		status: "success",
		data: notifications,
	});
});

const markAsRead = factory.updateOne(Notification);

const deleteNotification = factory.deleteOne(Notification);

const markAllAsRead = errorHandler(async (req, res, next) => {
	await Notification.updateMany(
		{ recipient: req.user._id, read: false },
		{ read: true }
	);

	res.status(200).json({
		status: "success",
		message: "All notifications marked as read",
	});
});

const createNotification = async ({
	recipient,
	sender,
	type,
	post,
	comment,
	content,
}) => {
	if (recipient.toString() === sender.toString()) return null; // Don't notify self

	const notification = await Notification.create({
		recipient,
		sender,
		type,
		post,
		comment,
		content,
	});

	await notification.populate("sender", "firstName lastName image");
	return notification;
};

export {
	getNotifications,
	markAsRead,
	deleteNotification,
	markAllAsRead,
	createNotification,
};
