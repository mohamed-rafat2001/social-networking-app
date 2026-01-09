import mongoose from "mongoose";

const replaySchema = new mongoose.Schema(
	{
		replayBody: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		commentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
		like: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		disLike: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		likeNum: {
			type: Number,
			default: 0,
		},
		disLikeNum: {
			type: Number,
			default: 0,
		},
		image: {
			public_id: String,
			secure_url: String,
		},
	},
	{ timestamps: true }
);

const Replay = mongoose.model("Replay", replaySchema);
export default Replay;
