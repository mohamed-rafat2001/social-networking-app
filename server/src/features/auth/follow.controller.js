import Follow from "./follow.model.js";
import User from "./user.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";

// Follow a user
const followUser = errorHandler(async (req, res, next) => {
	const userToFollowId = req.params.userId;
	const currentUserId = req.user._id;

	if (userToFollowId === currentUserId.toString()) {
		return next(appError.Error("You cannot follow yourself", "fail", 400));
	}

	const userToFollow = await User.findById(userToFollowId);
	if (!userToFollow) {
		return next(appError.Error("User not found", "fail", 404));
	}

	const existingFollow = await Follow.findOne({
		follower: currentUserId,
		following: userToFollowId,
	});

	if (existingFollow) {
		return next(appError.Error("Already following this user", "fail", 400));
	}

	await Follow.create({
		follower: currentUserId,
		following: userToFollowId,
	});

	// Create notification
	await createNotification({
		recipient: userToFollowId,
		sender: currentUserId,
		type: "follow",
	});

	res.status(200).json({ status: "success", message: "User followed successfully" });
});

// Unfollow a user
const unfollowUser = errorHandler(async (req, res, next) => {
	const userToUnfollowId = req.params.userId;
	const currentUserId = req.user._id;

	const follow = await Follow.findOneAndDelete({
		follower: currentUserId,
		following: userToUnfollowId,
	});

	if (!follow) {
		return next(appError.Error("You are not following this user", "fail", 400));
	}

	res.status(200).json({ status: "success", message: "User unfollowed successfully" });
});

// Get all followers of a user
const getFollowers = errorHandler(async (req, res, next) => {
	const userId = req.params.userId || req.user._id;

	const followers = await Follow.find({ following: userId })
		.populate("follower", "firstName lastName username image email")
		.sort({ createdAt: -1 });

	res.status(200).json({ 
		status: "success", 
		data: followers.map(f => f.follower) 
	});
});

// Get all users a user is following
const getFollowing = errorHandler(async (req, res, next) => {
	const userId = req.params.userId || req.user._id;

	const following = await Follow.find({ follower: userId })
		.populate("following", "firstName lastName username image email")
		.sort({ createdAt: -1 });

	res.status(200).json({ 
		status: "success", 
		data: following.map(f => f.following) 
	});
});

export { followUser, unfollowUser, getFollowers, getFollowing };
