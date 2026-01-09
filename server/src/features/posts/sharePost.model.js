import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		sharePost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Posts",
		},
	},
	{ timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);
export default Share;
