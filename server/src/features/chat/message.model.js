import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
		senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		content: String,
		file: [
			{
				public_id: String,
				secure_url: String,
			},
		],
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
