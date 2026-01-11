import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["like", "comment", "share", "follow", "message"],
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Posts",
		},
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
		content: {
			type: String,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export { Notification };
export default Notification;
