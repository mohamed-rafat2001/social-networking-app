import Posts from "./posts.model.js";
import Share from "./sharePost.model.js";
import Follow from "../follow/follow.model.js";
import ApiFeatures from "../../shared/utils/apiFeatures.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";
import * as factory from "../../shared/utils/handlerFactory.js";

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

	// Emit socket event for new post
	const io = req.app.get("io");
	if (io) {
		io.emit("newPost", {
			type: "post",
			postId: post._id,
			userId: req.user._id,
		});
	}

	res.status(200).json({ status: "success", data: post });
});

const singlePost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // post or share id
	let post = await Posts.findById(_id)
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

	// If not found in Posts, check if it's a Share
	if (!post) {
		const sharedPost = await Share.findById(_id)
			.populate({
				path: "sharePost",
				populate: [
					{ path: "userId" },
					{
						path: "comments",
						populate: [
							{ path: "userId" },
							{
								path: "replies",
								populate: { path: "userId" },
							},
						],
					},
				],
			})
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

		if (sharedPost && sharedPost.sharePost) {
			const hasNote = !!sharedPost.note;

			post = {
				...sharedPost.sharePost.toObject(),
				_id: sharedPost._id,
				originalPostId: sharedPost.sharePost._id,
				shareNote: sharedPost.note,
				shareDate: sharedPost.createdAt,
				type: "share",
				sharedBy: sharedPost.userId,
				// If has note, use share's own stats, otherwise use original post's stats
				views: hasNote ? sharedPost.views : sharedPost.sharePost.views,
				likes: hasNote ? sharedPost.likes : sharedPost.sharePost.likes,
				likesNumber: hasNote
					? sharedPost.likesNumber
					: sharedPost.sharePost.likesNumber,
				comments: hasNote ? sharedPost.comments : sharedPost.sharePost.comments,
				shares: hasNote ? [] : sharedPost.sharePost.shares,
				unLikes: hasNote ? sharedPost.unLikes : sharedPost.sharePost.unLikes,
				unLikesNumber: hasNote
					? sharedPost.unLikesNumber
					: sharedPost.sharePost.unLikesNumber,
			};
		}
	}

	if (!post) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: post });
});

const incrementView = errorHandler(async (req, res, next) => {
	let _id = req.params.id;

	// Check if it's a share
	const share = await Share.findById(_id);
	if (share) {
		if (share.note) {
			// Increment share views if it has a note
			const updatedShare = await Share.findByIdAndUpdate(
				_id,
				{ $inc: { views: 1 } },
				{ new: true }
			);
			return res.status(200).json({ status: "success", data: updatedShare });
		}
		// Otherwise increment original post views
		_id = share.sharePost;
	}

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
	const _id = req.params.id; // post or share id
	let posts = await Posts.findOneAndUpdate(
		{ _id, userId: req.user._id },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!posts) {
		// Try updating share note
		const share = await Share.findOneAndUpdate(
			{ _id, userId: req.user._id },
			{ note: req.body.text || req.body.note },
			{ new: true }
		);
		if (share) {
			posts = share;
		}
	}

	if (!posts) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: posts });
});

const deletePost = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // id for post or share
	let post = await Posts.findOne({ userId: req.user._id, _id });

	if (!post) {
		// Try deleting from shares
		const share = await Share.findOne({ userId: req.user._id, _id });
		if (share) {
			// Also need to remove the share reference from the original post
			await Posts.findByIdAndUpdate(share.sharePost, {
				$pull: { shares: { shareId: share._id } },
			});
			await share.deleteOne();
			return res.status(200).json({ status: "success", data: share });
		}
	}

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
	let queryFilter = {};

	// If following feed is requested, filter by followed users
	if (req.query.feed === "following" && req.user) {
		const following = await Follow.find({ follower: req.user._id });
		const followingIds = following.map((f) => f.following);
		// Include user's own posts in the following feed
		followingIds.push(req.user._id);
		queryFilter = { userId: { $in: followingIds } };
	}

	const postsFeatures = new ApiFeatures(Posts.find(queryFilter), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const sharesFeatures = new ApiFeatures(Share.find(queryFilter), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const [posts, sharedPosts] = await Promise.all([
		postsFeatures.query.populate("userId"),
		sharesFeatures.query
			.populate({
				path: "sharePost",
				populate: { path: "userId" },
			})
			.populate("userId"),
	]);

	// Combine and interleave posts and shared posts
	const combinedPosts = [
		...posts.map((p) => ({ ...p.toObject(), type: "post" })),
		...sharedPosts
			.filter((s) => s.sharePost)
			.map((s) => {
				const hasNote = !!s.note;
				return {
					...s.sharePost.toObject(),
					_id: s._id,
					originalPostId: s.sharePost._id,
					shareNote: s.note,
					shareDate: s.createdAt,
					type: "share",
					sharedBy: s.userId,
					// If has note, use share's own stats, otherwise use original post's stats
					views: hasNote ? s.views : s.sharePost.views,
					likes: hasNote ? s.likes : s.sharePost.likes,
					likesNumber: hasNote ? s.likesNumber : s.sharePost.likesNumber,
					comments: hasNote ? s.comments : s.sharePost.comments,
					shares: hasNote ? [] : s.sharePost.shares,
					unLikes: hasNote ? s.unLikes : s.sharePost.unLikes,
					unLikesNumber: hasNote ? s.unLikesNumber : s.sharePost.unLikesNumber,
				};
			}),
	].sort((a, b) => {
		const dateA = a.type === "share" ? a.shareDate : a.createdAt;
		const dateB = b.type === "share" ? b.shareDate : b.createdAt;
		return new Date(dateB) - new Date(dateA);
	});

	res.status(200).json({
		status: "success",
		results: combinedPosts.length,
		data: combinedPosts,
	});
});

const postsForUser = factory.getAll(Posts);

const likeOnPost = errorHandler(async (req, res, next) => {
	let _id = req.params.id; //post id
	let Model = Posts;

	// Check if it's a share
	const share = await Share.findById(_id);
	if (share) {
		if (share.note) {
			Model = Share;
		} else {
			_id = share.sharePost;
			Model = Posts;
		}
	}

	const doc = await Model.findById(_id);
	if (!doc) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}

	const numLike = doc.likes;
	const len = numLike.length;
	const numUnLike = doc.unLikes;
	const lenUnLike = numUnLike.length;
	const liked = numLike.includes(req.user._id.toString());

	if (liked === false) {
		const updatedDoc = await Model.findByIdAndUpdate(
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
		if (
			updatedDoc.userId &&
			updatedDoc.userId._id.toString() !== req.user._id.toString()
		) {
			await createNotification({
				recipient: updatedDoc.userId._id,
				sender: req.user._id,
				type: "like",
				post: updatedDoc._id,
			});
		}

		return res.status(200).json({ status: "success", data: updatedDoc });
	} else {
		const updatedDoc = await Model.findByIdAndUpdate(
			_id,
			{
				$pull: { likes: req.user._id },
				likesNumber: len - 1,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: updatedDoc });
	}
});

const unLikeOnPost = errorHandler(async (req, res, next) => {
	let _id = req.params.id; //post id
	let Model = Posts;

	// Check if it's a share
	const share = await Share.findById(_id);
	if (share) {
		if (share.note) {
			Model = Share;
		} else {
			_id = share.sharePost;
			Model = Posts;
		}
	}

	const doc = await Model.findById(_id);
	if (!doc) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}

	const numLike = doc.likes;
	const len = numLike.length;
	const numUnLike = doc.unLikes;
	const lenUnLike = numUnLike.length;
	const unLiked = numUnLike.includes(req.user._id.toString());
	const liked = numLike.includes(req.user._id.toString());

	if (unLiked === false) {
		const updatedDoc = await Model.findByIdAndUpdate(
			_id,
			{
				$push: { unLikes: req.user._id },
				unLikesNumber: lenUnLike + 1,
				$pull: { likes: req.user._id },
				likesNumber: liked ? len - 1 : len,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: updatedDoc });
	} else {
		const updatedDoc = await Model.findByIdAndUpdate(
			_id,
			{
				$pull: { unLikes: req.user._id },
				unLikesNumber: lenUnLike - 1,
			},
			{ new: true }
		);
		return res.status(200).json({ status: "success", data: updatedDoc });
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
