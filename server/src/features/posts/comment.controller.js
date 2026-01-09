import Posts from "./posts.model.js";
import Comment from "./comment.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";

const addComment = errorHandler(async (req, res, next) => {
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

	const post = await Posts.findByIdAndUpdate(postId, {
		$push: { comments: addComment._id },
	}).populate("userId");

	if (!post) {
		const error = appError.Error("post not found", "fail", 404);
		return next(error);
	}

	await addComment.save();

	// Create notification
	if (post.userId._id.toString() !== userId.toString()) {
		await createNotification({
			recipient: post.userId._id,
			sender: userId,
			type: "comment",
			post: post._id,
			content: addComment.content,
		});
	}

	res.status(200).json({ status: "success", data: addComment });
});

const singleComment = errorHandler(async (req, res, next) => {
	const commentId = req.params.id;
	const comment = await Comment.findById(commentId);

	if (!comment) {
		const error = appError.Error("comment not found", "fail", 404);
		return next(error);
	}

	await comment.populate("replies");
	await comment.populate("userId");

	res.status(200).json({ status: "success", data: comment });
});

const updateComment = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //comment id
	const comment = await Comment.findByIdAndUpdate(
		{ _id, userId: req.user._id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!comment) {
		const error = appError.Error("comment not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: comment });
});

const deleteComment = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // id for comment
	const commentData = await Comment.findOne({ _id, userId: req.user._id });
	if (!commentData) {
		const error = appError.Error("comment not found", "fail", 404);
		return next(error);
	}
	await commentData.deleteOne();
	res.status(200).json({ status: "success", data: commentData });
});

const likeOnComm = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // comment id
	const comment = await Comment.findById(_id);
	const isLiked = comment.like.find(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isLiked) {
		const like = await Comment.findByIdAndUpdate(
			_id,
			{
				$push: { like: req.user._id },
				$pull: { disLike: req.user._id },
				likeNum: comment.like.length + 1,
				disLikeNum:
					comment.disLike.length > 0
						? comment.disLike.length - 1
						: comment.disLike.length,
			},
			{ new: true, runValidators: true }
		);
		return res.status(200).json({ status: "success", data: like });
	}
	const like = await Comment.findByIdAndUpdate(
		_id,
		{
			$pull: { like: req.user._id, disLike: req.user._id },
			likeNum: comment.like.length - 1,
			disLikeNum: comment.disLike.length,
		},
		{ new: true, runValidators: true }
	);

	res.status(200).json({ status: "success", data: like });
});

const disLikeComm = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // post id
	const comment = await Comment.findById(_id);
	const isDisLiked = comment.disLike.find(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isDisLiked) {
		const disLike = await Comment.findByIdAndUpdate(
			_id,
			{
				$pull: { like: req.user._id },
				$push: { disLike: req.user._id },
				disLikeNum: comment.disLike.length + 1,
				likeNum:
					comment.like.length > 0
						? comment.like.length - 1
						: comment.like.length,
			},
			{ new: true, runValidators: true }
		);

		return res.status(200).json({ status: "success", data: disLike });
	}

	const disLike = await Comment.findByIdAndUpdate(
		_id,
		{
			$pull: { like: req.user._id, disLike: req.user._id },
			likeNum: comment.like.length,
			disLikeNum: comment.disLike.length - 1,
		},
		{ new: true, runValidators: true }
	);

	res.status(200).json({ status: "success", data: disLike });
});

const postComments = errorHandler(async (req, res, next) => {
	const postId = req.params.id;
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
	postComments,
};
