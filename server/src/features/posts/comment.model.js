import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		commentBody: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Posts",
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Replay",
			},
		],
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
		likeNum: { type: Number, default: 0 },
		disLikeNum: { type: Number, default: 0 },
		image: { public_id: String, secure_url: String },
	},
	{ timestamps: true }
);

commentSchema.methods.toJSON = function () {
	const comment = this.toObject();
	return comment;
};

const Comment = mongoose.model("Comment", commentSchema);
export { Comment };
export default Comment;
