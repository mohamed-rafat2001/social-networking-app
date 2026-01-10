import User from "./user.model.js";
import Follow from "../follow/follow.model.js";
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
	const {
		firstName,
		lastName,
		email,
		password,
		gender,
		phoneNumber,
		city,
		country,
		userType,
	} = req.body;

	const user = new User({
		firstName,
		lastName,
		email,
		password,
		gender,
		phoneNumber,
		city,
		country,
		userType,
		role: "user",
	});

	const token = user.creatToken();
	await user.save();
	res.status(200).json({ status: "success", data: { user, token } });
});

const profileImg = errorHandler(async (req, res, next) => {
	let newImageData = null;

	// Update image if file is uploaded
	if (req.file) {
		// Delete old image from cloudinary if it exists
		if (req.user.image?.public_id) {
			await cloudinary.uploader.destroy(req.user.image.public_id);
		}

		const { public_id, secure_url } = await cloudinary.uploader.upload(
			req.file.path,
			{ folder: `social-app/user/id_${req.user._id}/profileImg` }
		);
		newImageData = { public_id, secure_url };
		req.user.image = newImageData;
	}

	await req.user.save();

	// Create a post for the profile update if an image was uploaded
	if (newImageData) {
		await Posts.create({
			userId: req.user._id,
			text: req.body.bio || "Updated profile picture",
			fileUp: [newImageData],
			isProfileUpdate: true,
		});
	}

	res.status(200).json({ status: "success", data: req.user });
});

const deleteProfileImg = errorHandler(async (req, res, next) => {
	if (req.user.image?.public_id) {
		await cloudinary.uploader.destroy(req.user.image.public_id);
	}
	req.user.image = undefined;
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
	const allowedUpdates = [
		"firstName",
		"lastName",
		"phoneNumber",
		"city",
		"country",
		"bio",
		"gender",
		"userType",
		"acountType",
	];

	const updates = Object.keys(req.body);
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		const error = appError.Error("Invalid updates!", "fail", 400);
		return next(error);
	}

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
	const userId =
		req.params.userId &&
		req.params.userId !== "user" &&
		req.params.userId !== "undefined"
			? req.params.userId
			: req.user._id;

	const userData = await User.findById(userId);

	if (!userData) {
		const error = appError.Error("no user", "fail", 404);
		return next(error);
	}

	// Fetch followers, following, posts, and shared posts
	const [followers, following, posts, sharedPosts] = await Promise.all([
		Follow.find({ following: userId }).populate(
			"follower",
			"firstName lastName username image"
		),
		Follow.find({ follower: userId }).populate(
			"following",
			"firstName lastName username image"
		),
		Posts.find({ userId: userData._id }).populate("userId"),
		Share.find({ userId: userData._id }).populate({
			path: "sharePost",
			populate: { path: "userId" },
		}),
	]);

	// Combine posts and shared posts
	const allUserPosts = [
		...posts.map((p) => ({ ...p.toObject(), type: "post" })),
		...sharedPosts.map((s) => ({
			...s.sharePost.toObject(),
			_id: s._id,
			originalPostId: s.sharePost._id,
			shareNote: s.note,
			shareDate: s.createdAt,
			type: "share",
			sharedBy: userData,
		})),
	].sort((a, b) => {
		const dateA = a.type === "share" ? a.shareDate : a.createdAt;
		const dateB = b.type === "share" ? b.shareDate : b.createdAt;
		return new Date(dateB) - new Date(dateA);
	});

	const userObj = userData.toObject();
	userObj.followers = followers.map((f) => f.follower);
	userObj.following = following.map((f) => f.following);
	userObj.posts = allUserPosts;

	userObj.isFollowing = followers.some(
		(f) => f.follower._id.toString() === req.user._id.toString()
	);

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
	deleteProfileImg,
};
