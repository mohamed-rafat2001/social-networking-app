import User from "./user.model.js";
import Follow from "../follow/follow.model.js";
import Posts from "../posts/posts.model.js";
import Share from "../posts/sharePost.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import Email from "../../shared/utils/sendEmail.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import apiFeatures from "../../shared/utils/apiFeatures.js";

const sendToken = (user, statusCode, res) => {
	const token = user.createToken();
	const cookieOptions = {
		expires: new Date(
			Date.now() +
				(process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	};

	res.cookie("token", token, cookieOptions);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		data: {
			user,
		},
	});
};

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
		major,
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
		major,
		userType,
		role: "user",
	});

	await user.save();
	sendToken(user, 201, res);
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

	sendToken(user, 200, res);
});

const logout = (req, res) => {
	res.cookie("token", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

const profile = errorHandler(async (req, res, next) => {
	const query = req.query;

	const postsFeatures = new apiFeatures(
		Posts.find({ userId: req.user._id }),
		query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const sharesFeatures = new apiFeatures(
		Share.find({ userId: req.user._id }),
		query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const [posts, share] = await Promise.all([
		postsFeatures.query,
		sharesFeatures.query.populate("sharePost"),
	]);

	// Combine and interleave
	const combinedPosts = [
		...posts.map((p) => ({ ...p.toObject(), type: "post" })),
		...share
			.filter((s) => s.sharePost)
			.map((s) => ({
				...s.sharePost.toObject(),
				_id: s._id,
				originalPostId: s.sharePost._id,
				shareNote: s.note,
				shareDate: s.createdAt,
				type: "share",
				sharedBy: req.user,
			})),
	].sort((a, b) => {
		const dateA = a.type === "share" ? a.shareDate : a.createdAt;
		const dateB = b.type === "share" ? b.shareDate : b.createdAt;
		return new Date(dateB) - new Date(dateA);
	});

	res.status(200).json({
		status: "success",
		results: combinedPosts.length,
		data: { posts: combinedPosts },
	});
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
		"major",
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

const passwordResetCodeTemplate = (code, name, expires) => {
	return `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
			<h2 style="color: #333; text-align: center;">Password Reset Request</h2>
			<p>Hello ${name},</p>
			<p>You requested to reset your password. Use the following 6-digit code to complete the process:</p>
			<div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007bff; border-radius: 5px; margin: 20px 0;">
				${code}
			</div>
			<p>This code will expire in 10 minutes (at ${new Date(
				expires
			).toLocaleTimeString()}).</p>
			<p>If you didn't request this, please ignore this email.</p>
			<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
			<p style="font-size: 12px; color: #777; text-align: center;">Social App Team</p>
		</div>
	`;
};

const forgotPass = errorHandler(async (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		return next(appError.Error("please provide email", "fail", 400));
	}

	// find the user using email
	const user = await User.findOne({ email });
	if (!user) {
		return next(appError.Error("user not found", "fail", 404));
	}

	// create passwordResetToken
	const resetCode = user.createPasswordResetCode();
	await user.save({ validateBeforeSave: false });

	// sendEmail to user contain the uniqeCode
	if (!resetCode) {
		return next(appError.Error("something went wrong", "fail", 500));
	}

	try {
		await Email({
			email: user.email,
			subject: "password reset token",
			html: passwordResetCodeTemplate(
				resetCode,
				`${user.firstName} ${user.lastName}`,
				user.passwordResetExpires
			),
		});
	} catch (err) {
		user.passwordResetCode = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(appError.Error("Error sending the email", "fail", 500));
	}

	res.status(200).json({ status: "success", data: "please check your email" });
});

const resetPassword = errorHandler(async (req, res, next) => {
	// get resetCode and password from req.body
	const { code: resetCode, password, confirmPassword } = req.body;

	// check if resetCode and password are provided
	if (!resetCode || !password || !confirmPassword) {
		return next(appError.Error("please provide all fields", "fail", 400));
	}

	if (password !== confirmPassword) {
		return next(
			appError.Error("password and confirm password not match", "fail", 400)
		);
	}

	// find the user using resetCode
	const user = await User.findOne({
		passwordResetCode: resetCode,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(appError.Error("invalid or expired reset code", "fail", 400));
	}

	// update the user password
	user.password = password;
	user.passwordResetCode = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	sendToken(user, 200, res);
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
	logout,
};
