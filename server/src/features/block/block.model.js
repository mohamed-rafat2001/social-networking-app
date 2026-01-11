import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		blockedUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

const Block = mongoose.model("Block", blockSchema);

export { Block };
export default Block;
