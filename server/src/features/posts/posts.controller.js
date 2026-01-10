import Posts from "./posts.model.js";
import Share from "./sharePost.model.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";

const addPost = errorHandler(async (req, res, next) => {
	let post;
	if (req.files && req.files.length > 0) {
		const uploadPromises = req.files.map((file) =>
			cloudinary.uploader.upload(file.path, {
				folder: `e-Learning/user/${req.user._id}/posts`,
				resource_type: "auto",
			})
		);

		try {
			const uploadResults = await Promise.all(uploadPromises);
			const files = uploadResults.map((result) => ({
				public_id: result.public_id,
				secure_url: result.secure_url,
			}));
			post = new Posts({ ...req.body, userId: req.user._id, fileUp: files });
		} catch (uploadError) {
			console.error("Cloudinary upload error:", uploadError);
			const error = appError.Error(
				`Failed to upload images: ${uploadError.message}`,
				"fail",
				500
			);
			return next(error);
		}
	} else {
		post = new Posts({ ...req.body, userId: req.user._id });
	}

	if (!post) {
		const error = appError.Error("not add post", "fail", 404);
		return next(error);
	}

	await post.save();
	res.status(200).json({ status: "success", data: post });
});

const singlePost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //post id
	const post = await Posts.findById(_id)
		.populate("userId")
		.populate({
			path: "comments",
			populate: [
				{ path: "userId" },
				{
					path: "replies",
					populate: { path: "userId" },
				},
			],
		});
	if (!post) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: post });
});

const incrementView = errorHandler(async (req, res, next) => {
	const _id = req.params.id;
	const post = await Posts.findByIdAndUpdate(
		_id,
		{ $inc: { views: 1 } },
		{ new: true }
	);
	if (!post) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: post });
});

const updatePost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //post id
	const posts = await Posts.findByIdAndUpdate(
		{ _id, userId: req.user },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!posts) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: posts });
});

const deletePost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // id for post
	const post = await Posts.findOne({ userId: req.user._id, _id });

	if (!post) {
		const error = appError.Error(
			"Post not found or you don't have permission to delete it",
			"fail",
			404
		);
		return next(error);
	}

	// Delete from Cloudinary if there are files
	if (post.fileUp && post.fileUp.length > 0) {
		const deletePromises = post.fileUp.map((file) =>
			cloudinary.uploader.destroy(file.public_id)
		);
		await Promise.all(deletePromises);
	}

	await post.deleteOne();
	res.status(200).json({ status: "success", data: post });
});

const allPosts = errorHandler(async (req, res, next) => {
	const [posts, sharedPosts] = await Promise.all([
		Posts.find({}).populate("userId"),
		Share.find({})
			.populate({
				path: "sharePost",
				populate: { path: "userId" },
			})
			.populate("userId"),
	]);

	// Combine posts and shared posts
	const combinedPosts = [
		...posts.map((p) => ({ ...p.toObject(), type: "post" })),
		...sharedPosts
			.filter((s) => s.sharePost) // Ensure original post exists
			.map((s) => ({
				...s.sharePost.toObject(),
				_id: s._id,
				originalPostId: s.sharePost._id,
				shareNote: s.note,
				shareDate: s.createdAt,
				type: "share",
				sharedBy: s.userId,
			})),
	].sort((a, b) => {
		const dateA = a.type === "share" ? a.shareDate : a.createdAt;
		const dateB = b.type === "share" ? b.shareDate : b.createdAt;
		return new Date(dateB) - new Date(dateA);
	});

	if (!combinedPosts.length && !posts.length) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: combinedPosts });
});

const postsForUser = errorHandler(async (req, res, next) => {
	const posts = await Posts.find({ userId: req.user._id });
	if (!posts) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: posts });
});

const likeOnPost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //post id
	const likesnum = await Posts.findById(_id);
	const numLike = likesnum.likes;
	const len = numLike.length;
	const numUnLike = likesnum.unLikes;
	const lenUnLike = numUnLike.length;
	const liked = numLike.includes(req.user._id.toString());
	if (liked === false) {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$push: { likes: req.user._id },
				likesNumber: len + 1,
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike > 0 ? lenUnLike - 1 : lenUnLike,
			},
			{ new: true }
		).populate("userId");

		// Create notification
		if (post.userId._id.toString() !== req.user._id.toString()) {
			await createNotification({
				recipient: post.userId._id,
				sender: req.user._id,
				type: "like",
				post: post._id,
			});
		}

		return res.status(200).json({ status: "success", data: post });
	} else if (liked === true) {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike,
				$pull: { likes: req.user._id },
				likesNumber: len - 1,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: post });
	} else {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$pull: { likes: req.user._id },
				likesNumber: len,
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike,
			},
			{ new: true }
		);
		res.status(200).json({ status: "success", data: post });
	}
});

const unLikeOnPost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //post id
	const likesnum = await Posts.findById(_id);
	const numLike = likesnum.likes;
	const len = numLike.length;
	const numUnLike = likesnum.unLikes;
	const lenUnLike = numUnLike.length;
	const unLiked = numUnLike.includes(req.user._id.toString());
	if (unLiked === false) {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$push: { unLikes: req.user._id },
				unLikesNumber: lenUnLike + 1,
				$pull: { likes: req.user._id },
				likesNumber: len,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: post });
	} else if (unLiked === true) {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$pull: { likes: req.user._id },
				likesNumber: len,
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike - 1,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: post });
	} else {
		const post = await Posts.findByIdAndUpdate(
			_id,
			{
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike,
				$pull: { likes: req.user._id },
				likesNumber: len,
			},
			{ new: true }
		);
		res.status(200).json({ status: "success", data: post });
	}
});

export {
	addPost,
	singlePost,
	incrementView,
	updatePost,
	deletePost,
	allPosts,
	postsForUser,
	likeOnPost,
	unLikeOnPost,
};
