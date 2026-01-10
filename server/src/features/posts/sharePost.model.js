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
		note: String,
		image: [
			{
				public_id: String,
				secure_url: String,
			},
		],
	},
	{ timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);
export default Share;
