import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
	{
		follower: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		following: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

// Prevent a user from following themselves
followSchema.pre("save", function (next) {
	if (this.follower.toString() === this.following.toString()) {
		const error = new Error("You cannot follow yourself");
		return next(error);
	}
	next();
});

// Ensure a user can only follow another user once
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
