import User from "./user.model.js";
import Posts from "../posts/posts.model.js";
import Share from "../posts/sharePost.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import Email from "../../shared/utils/sendEmail.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import { createNotification } from "../notifications/notification.controller.js";
import apiFeatures from "../../shared/utils/apiFeatures.js";

const signUp = errorHandler(async (req, res, next) => {
	const user = new User(req.body);
	const token = user.creatToken();
	await user.save();
	res.status(200).json({ status: "success", data: { user, token } });
});

const profileImg = errorHandler(async (req, res, next) => {
	const { public_id, secure_url } = await cloudinary.uploader.upload(
		req.file.path,
		{ folder: `e-Learning/user/id_${req.user._id}/profileImg` }
	);
	req.user.image = { public_id, secure_url };
	await req.user.save();
	res.status(200).json({ status: "success", data: req.user });
});

const login = errorHandler(async (req, res, next) => {
	const email = req.body.email;
	const user = await User.findOne({ email });
	if (!user) {
		const error = appError.Error("email or password is wrong", "fail", 401);
		return next(error);
	}
	const pass = await bcryptjs.compare(req.body.password, user.password);
	if (!pass) {
		const error = appError.Error("email or password is wrong", "fail", 401);
		return next(error);
	}

	// Set user as active on login
	user.isActive = true;
	await user.save();

	const token = user.creatToken();
	res.status(200).json({ status: "success", data: { user, token } });
});

const profile = errorHandler(async (req, res, next) => {
	const query = req.query;

	let share = new apiFeatures(
		Share.find({ userId: req.user._id }),
		query
	).paginate();
	let posts = new apiFeatures(
		Posts.find({ userId: req.user._id }),
		query
	).paginate();
	posts = await posts.model;
	share = await share.model.populate("sharePost");

	if (share.length === 0 && posts.length === 0) {
		const error = appError.Error("no posts found", "fail", 404);
		return next(error);
	}
	res
		.status(200)
		.json({ status: "success", data: { posts: [...share, ...posts] } });
});

const updateProfile = errorHandler(async (req, res, next) => {
	const updates = Object.keys(req.body);
	updates.forEach((el) => (req.user[el] = req.body[el]));
	await req.user.save();
	res.status(200).json({ status: "success", data: req.user });
});

const deleteAcount = errorHandler(async (req, res, next) => {
	const user = await User.deleteOne(req.user);
	if (!user) {
		const error = appError.Error("user not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: user });
});

const forgotPass = errorHandler(async (req, res, next) => {
	const email = req.body.email;
	const user = await User.findOne({ email });
	if (user) {
		Email(user);
	}
	await user.save();
	res.status(200).json({ status: "success", data: "please check your email" });
});

const resetPassword = errorHandler(async (req, res, next) => {
	const passwordResetToken = req.body.code;
	const user = await User.findOne({ passwordResetToken });
	if (!user) {
		const error = appError.Error("invalid code", "fail", 500);
		return next(error);
	}
	user.password = req.body.password;
	user.passwordResetToken = "";
	const token = user.creatToken();
	await user.save();
	res.status(200).json({ status: "success", data: { user, token } });
});

const user = errorHandler(async (req, res, next) => {
	const userId = req.params.userId;
	let userData;

	if (userId && userId !== "user" && userId !== "undefined") {
		userData = await User.findById(userId)
			.populate("followers", "firstName lastName username image")
			.populate("following", "firstName lastName username image");
	} else {
		userData = await User.findById(req.user._id)
			.populate("followers", "firstName lastName username image")
			.populate("following", "firstName lastName username image");
	}

	if (!userData) {
		const error = appError.Error("no user", "fail", 404);
		return next(error);
	}

	// Fetch posts for this user to update the post count in profile
	const posts = await Posts.find({ userId: userData._id });
	const userObj = userData.toObject();
	userObj.posts = posts;

	res.status(200).json({ status: "success", data: userObj });
});

const searchUsers = errorHandler(async (req, res, next) => {
	const searchTerm = req.query.name;
	if (!searchTerm) {
		return res.status(200).json({ status: "success", data: [] });
	}

	const users = await User.find({
		$or: [
			{ firstName: { $regex: searchTerm, $options: "i" } },
			{ lastName: { $regex: searchTerm, $options: "i" } },
			{ username: { $regex: searchTerm, $options: "i" } },
			{ email: { $regex: searchTerm, $options: "i" } },
		],
		_id: { $ne: req.user._id },
	}).select("firstName lastName email image username");

	res.status(200).json({ status: "success", data: users });
});

const followUser = errorHandler(async (req, res, next) => {
	const userToFollow = await User.findById(req.params.userId);
	const currentUser = await User.findById(req.user._id);

	if (!userToFollow) {
		return next(appError.Error("User not found", "fail", 404));
	}

	if (currentUser.following.includes(userToFollow._id)) {
		return next(appError.Error("Already following this user", "fail", 400));
	}

	currentUser.following.push(userToFollow._id);
	userToFollow.followers.push(currentUser._id);

	await currentUser.save();
	await userToFollow.save();

	// Create notification
	await createNotification({
		recipient: userToFollow._id,
		sender: currentUser._id,
		type: "follow",
	});

	res.status(200).json({ status: "success", data: currentUser });
});

const unfollowUser = errorHandler(async (req, res, next) => {
	const userToUnfollow = await User.findById(req.params.userId);
	const currentUser = await User.findById(req.user._id);

	if (!userToUnfollow) {
		return next(appError.Error("User not found", "fail", 404));
	}

	currentUser.following = currentUser.following.filter(
		(id) => id.toString() !== userToUnfollow._id.toString()
	);
	userToUnfollow.followers = userToUnfollow.followers.filter(
		(id) => id.toString() !== currentUser._id.toString()
	);

	await currentUser.save();
	await userToUnfollow.save();

	res.status(200).json({ status: "success", data: currentUser });
});

export {
	signUp,
	profileImg,
	login,
	profile,
	updateProfile,
	deleteAcount,
	forgotPass,
	resetPassword,
	user,
	searchUsers,
	followUser,
	unfollowUser,
};
