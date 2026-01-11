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
		views: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		likesNumber: {
			type: Number,
			default: 0,
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		unLikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		unLikesNumber: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);
export { Share };
export default Share;
