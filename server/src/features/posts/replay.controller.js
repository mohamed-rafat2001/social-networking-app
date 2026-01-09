import Comment from "./comment.model.js";
import Replay from "./replay.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";

const addReplay = errorHandler(async (req, res, next) => {
	const commentId = req.params.id; //comment id
	const userId = req.user._id; // user id

	let addReplay;
	if (req.file) {
		const { public_id, secure_url } = await cloudinary.uploader.upload(
			req.file.path,
			{
				folder: `e-Learning/user/id_${req.user._id}/replay/commentId_${commentId}`,
			}
		);

		addReplay = new Replay({
			...req.body,
			commentId,
			userId,
			image: { public_id, secure_url },
		});
	} else {
		addReplay = new Replay({ ...req.body, commentId, userId });
	}
	const comment = await Comment.findByIdAndUpdate(commentId, {
		$push: { replies: addReplay._id },
	}).populate("userId");

	if (!comment) {
		const error = appError.Error("comment not found", "fail", 404);
		return next(error);
	}

	await addReplay.save();

	// Create notification
	if (comment.userId._id.toString() !== userId.toString()) {
		await createNotification({
			recipient: comment.userId._id,
			sender: userId,
			type: "comment", // Using comment type for replies too as per NotificationList logic
			post: comment.postId,
			comment: comment._id,
			content: addReplay.content,
		});
	}

	res.status(200).json({ status: "success", data: addReplay });
});

const singleReplay = errorHandler(async (req, res, next) => {
	const replayId = req.params.id;
	const replay = await Replay.findById(replayId);
	if (!replay) {
		const error = appError.Error("replay not found", "fail", 404);
		return next(error);
	}
	await replay.populate("userId");
	res.status(200).json({ status: "success", data: replay });
});

const updateReplay = errorHandler(async (req, res, next) => {
	const _id = req.params.id; //replay id
	const replay = await Replay.findByIdAndUpdate(
		{ _id, userId: req.user._id },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!replay) {
		const error = appError.Error("replay not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: replay });
});

const deleteReplay = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // id for replay
	const replay = await Replay.findOneAndDelete({ _id, userId: req.user._id });
	if (!replay) {
		const error = appError.Error("replay not found", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: replay });
});

const likeOnReplay = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // comment id
	const replay = await Replay.findById(_id);
	const isLiked = replay.like.find(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isLiked) {
		const like = await Replay.findByIdAndUpdate(
			_id,
			{
				$push: { like: req.user._id },
				$pull: { disLike: req.user._id },
				likeNum: replay.like.length + 1,
				disLikeNum:
					replay.disLike.length > 0
						? replay.disLike.length - 1
						: replay.disLike.length,
			},
			{ new: true, runValidators: true }
		);
		return res.status(200).json({ status: "success", data: like });
	}

	const like = await Replay.findByIdAndUpdate(
		_id,
		{
			$pull: { like: req.user._id, disLike: req.user._id },
			likeNum: replay.like.length - 1,
			disLikeNum: replay.disLike.length,
		},
		{ new: true, runValidators: true }
	);
	res.status(200).json({ status: "success", data: like });
});

const disLikeOnReplay = errorHandler(async (req, res, next) => {
	const _id = req.params.id; // post id
	const replay = await Replay.findById(_id);
	const isDisLiked = replay.disLike.find(
		(el) => el.toString() === req.user._id.toString()
	);
	if (!isDisLiked) {
		const disLike = await Replay.findByIdAndUpdate(
			_id,
			{
				$pull: { like: req.user._id },
				$push: { disLike: req.user._id },
				disLikeNum: replay.disLike.length + 1,
				likeNum:
					replay.like.length > 0 ? replay.like.length - 1 : replay.like.length,
			},
			{ new: true, runValidators: true }
		);
		return res.status(200).json({ status: "success", data: disLike });
	}

	const disLike = await Replay.findByIdAndUpdate(
		_id,
		{
			$pull: { like: req.user._id, disLike: req.user._id },
			likeNum: replay.like.length,
			disLikeNum: replay.disLike.length - 1,
		},
		{ new: true, runValidators: true }
	);
	res.status(200).json({ status: "success", data: disLike });
});

export {
	addReplay,
	singleReplay,
	updateReplay,
	deleteReplay,
	likeOnReplay,
	disLikeOnReplay,
};
