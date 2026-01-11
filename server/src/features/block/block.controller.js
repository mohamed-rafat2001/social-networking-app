import Block from "./block.model.js";
import User from "../auth/user.model.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";
import { AppError } from "../../shared/utils/appError.js";

// Block a user
const blockUser = catchAsync(async (req, res, next) => {
	const userToBlockId = req.params.userId;
	const currentUserId = req.user._id;

	if (userToBlockId === currentUserId.toString()) {
		return next(new AppError("You cannot block yourself", "fail", 400));
	}

	const userToBlock = await User.findById(userToBlockId);
	if (!userToBlock) {
		return next(new AppError("User not found", "fail", 404));
	}

	let blockList = await Block.findOne({ userId: currentUserId });

	if (!blockList) {
		blockList = await Block.create({
			userId: currentUserId,
			blockedUsers: [userToBlockId],
		});
		// Update user model with blockListId
		await User.findByIdAndUpdate(currentUserId, { blockListId: blockList._id });
	} else {
		if (blockList.blockedUsers.includes(userToBlockId)) {
			return next(new AppError("User already blocked", "fail", 400));
		}
		blockList.blockedUsers.push(userToBlockId);
		await blockList.save();
	}

	res
		.status(200)
		.json({ status: "success", message: "User blocked successfully" });
});

// Unblock a user
const unblockUser = catchAsync(async (req, res, next) => {
	const userToUnblockId = req.params.userId;
	const currentUserId = req.user._id;

	const blockList = await Block.findOne({ userId: currentUserId });

	if (!blockList || !blockList.blockedUsers.includes(userToUnblockId)) {
		return next(new AppError("User is not blocked", "fail", 400));
	}

	blockList.blockedUsers = blockList.blockedUsers.filter(
		(id) => id.toString() !== userToUnblockId
	);
	await blockList.save();

	res
		.status(200)
		.json({ status: "success", message: "User unblocked successfully" });
});

// Get blocked users list
const getBlockedUsers = catchAsync(async (req, res, next) => {
	const currentUserId = req.user._id;

	const blockList = await Block.findOne({ userId: currentUserId }).populate(
		"blockedUsers",
		"firstName lastName username image email"
	);

	res.status(200).json({
		status: "success",
		data: blockList ? blockList.blockedUsers : [],
	});
});

export { blockUser, unblockUser, getBlockedUsers };
