import { Posts } from "./posts.model.js";
import { Share } from "./sharePost.model.js";
import { Comment } from "./comment.model.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";
import { AppError } from "../../shared/utils/appError.js";
import { cloudinary } from "../../shared/utils/cloudinary.js";
import { createNotification } from "../notifications/notification.controller.js";

import * as factory from "../../shared/utils/handlerFactory.js";

const addComment = catchAsync(async (req, res, next) => {
	const postId = req.params.id; //post id
	const userId = req.user._id; // user id
	let addComment;
	if (req.file) {
		const { public_id, secure_url } = await cloudinary.uploader.upload(
			req.file.path,
			{ folder: `e-Learning/user/id_${req.user._id}/comment/postId_${postId}` }
		);

		addComment = new Comment({
			...req.body,
			postId,
			userId,
			image: { public_id, secure_url },
		});
	} else {
		addComment = new Comment({ ...req.body, postId, userId });
	}

	let post = await Posts.findByIdAndUpdate(postId, {
		$push: { comments: addComment._id },
	}).populate("userId");

	if (!post) {
		// If not found in Posts, check if it's a Share
		const share = await Share.findById(postId).populate({
			path: "sharePost",
			populate: { path: "userId" },
		});

		if (share) {
			if (share.note) {
				// If share has a note, add comment to the share itself
				await Share.findByIdAndUpdate(postId, {
					$push: { comments: addComment._id },
				});
				post = share; // For notification purposes
			} else if (share.sharePost) {
				// If no note, add comment to the original post
				post = await Posts.findByIdAndUpdate(share.sharePost._id, {
					$push: { comments: addComment._id },
				}).populate("userId");

				// Update addComment to point to the original post ID for consistency
				addComment.postId = share.sharePost._id;
			}
		} else {
			const error = new AppError("post not found", "fail", 404);
			return next(error);
		}
	}

	await addComment.save();

	// Create notification
	if (post && post.userId && post.userId._id.toString() !== userId.toString()) {
		await createNotification({
			recipient: post.userId._id,
			sender: userId,
			type: "comment",
			post: post._id,
			content: addComment.commentBody,
		});
	}

	res.status(200).json({ status: "success", data: addComment });
});

const singleComment = factory.getOne(Comment, ["replies", "userId"]);
const updateComment = factory.updateOneByOwner(Comment);
const deleteComment = factory.deleteOneByOwner(Comment);

const likeOnComm = catchAsync(async (req, res, next) => {
	const _id = req.params.id; // comment id
	const comment = await Comment.findById(_id);
	if (!comment) {
		return next(new AppError("Comment not found", "fail", 404));
	}
	const isLiked = comment.like.some(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isLiked) {
		const like = await Comment.findByIdAndUpdate(
			_id,
			{
				$push: { like: req.user._id },
				$pull: { disLike: req.user._id },
				$inc: { likeNum: 1 },
				$inc: {
					disLikeNum: comment.disLike.some(
						(id) => id.toString() === req.user._id.toString()
					)
						? -1
						: 0,
				},
			},
			{ new: true }
		);

		// Recalculate numbers to be sure
		like.likeNum = like.like.length;
		like.disLikeNum = like.disLike.length;
		await like.save();

		res.status(200).json({ status: "success", data: like });
	} else {
		const unLike = await Comment.findByIdAndUpdate(
			_id,
			{
				$pull: { like: req.user._id },
				$inc: { likeNum: -1 },
			},
			{ new: true }
		);

		// Recalculate numbers to be sure
		unLike.likeNum = unLike.like.length;
		unLike.disLikeNum = unLike.disLike.length;
		await unLike.save();

		res.status(200).json({ status: "success", data: unLike });
	}
});

const disLikeComm = catchAsync(async (req, res, next) => {
	const _id = req.params.id; // comment id
	const comment = await Comment.findById(_id);
	if (!comment) {
		return next(new AppError("Comment not found", "fail", 404));
	}
	const isDisLiked = comment.disLike.some(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isDisLiked) {
		const disLike = await Comment.findByIdAndUpdate(
			_id,
			{
				$push: { disLike: req.user._id },
				$pull: { like: req.user._id },
				$inc: { disLikeNum: 1 },
				$inc: {
					likeNum: comment.like.some(
						(id) => id.toString() === req.user._id.toString()
					)
						? -1
						: 0,
				},
			},
			{ new: true }
		);

		// Recalculate numbers to be sure
		disLike.likeNum = disLike.like.length;
		disLike.disLikeNum = disLike.disLike.length;
		await disLike.save();

		res.status(200).json({ status: "success", data: disLike });
	} else {
		const unDisLike = await Comment.findByIdAndUpdate(
			_id,
			{
				$pull: { disLike: req.user._id },
				$inc: { disLikeNum: -1 },
			},
			{ new: true }
		);

		// Recalculate numbers to be sure
		unDisLike.likeNum = unDisLike.like.length;
		unDisLike.disLikeNum = unDisLike.disLike.length;
		await unDisLike.save();

		res.status(200).json({ status: "success", data: unDisLike });
	}
});

const postComments = catchAsync(async (req, res, next) => {
	let postId = req.params.id;

	// Check if it's a share without a note
	const share = await Share.findById(postId);
	if (share && !share.note) {
		postId = share.sharePost;
	}

	const comments = await Comment.find({ postId })
		.populate("userId")
		.populate({
			path: "replies",
			populate: {
				path: "userId",
				select: "firstName lastName username image",
			},
		});
	res.status(200).json({ status: "success", data: comments });
});

export {
	addComment,
	singleComment,
	updateComment,
	deleteComment,
	likeOnComm,
	disLikeComm,
	postComments
};
