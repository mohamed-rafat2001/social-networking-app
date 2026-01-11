import { Notification } from "./notification.model.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";
import * as factory from "../../shared/utils/handlerFactory.js";

const getNotifications = catchAsync(async (req, res, next) => {
	const notifications = await Notification.find({ recipient: req.user._id })
		.populate("sender", "firstName lastName image")
		.populate("post", "text")
		.sort({ createdAt: -1 });

	res.status(200).json({
		status: "success",
		data: notifications,
	});
});

const markAsRead = catchAsync(async (req, res, next) => {
	const notification = await Notification.findByIdAndUpdate(
		req.params.id,
		{ read: true },
		{ new: true }
	);

	res.status(200).json({
		status: "success",
		data: notification,
	});
});

const deleteNotification = factory.deleteOne(Notification);

const markAllAsRead = catchAsync(async (req, res, next) => {
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
