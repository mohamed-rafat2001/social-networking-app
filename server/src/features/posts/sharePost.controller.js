import Share from "./sharePost.model.js";
import Post from "./posts.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import cloudinary from "../../shared/utils/cloudinary.js";
import appError from "../../shared/utils/appError.js";
import { createNotification } from "../notifications/notification.controller.js";

const sharePost = errorHandler(async (req, res, next) => {
	const postId = req.params.id; //post id
	const _id = req.user._id; //user id
	let sharePO;
	if (req.files && req.files.length > 0) {
		const files = [];
		for (const file of req.files) {
			const { public_id, secure_url } = await cloudinary.uploader.upload(
				file.path,
				{ folder: `e-Learning/user/id_${req.user._id}/share/postId_${postId}` }
			);
			files.push({ public_id, secure_url });
		}

		sharePO = new Share({
			...req.body,
			userId: _id,
			sharePost: postId,
			image: files,
		});
		await Post.findByIdAndUpdate(
			postId,
			{
				$push: { shares: { shareId: sharePO._id, userId: _id } },
			},
			{ new: true }
		);
	} else {
		sharePO = new Share({ ...req.body, userId: _id, sharePost: postId });
		await Post.findByIdAndUpdate(
			postId,
			{
				$push: { shares: { shareId: sharePO._id, userId: _id } },
			},
			{ new: true }
		);
	}

	if (!sharePO) {
		const error = appError.Error("not shared", "fail", 404);
		return next(error);
	}
	await sharePO.save();

	// Create notification
	const post = await Post.findById(postId).populate("userId");
	if (post && post.userId._id.toString() !== _id.toString()) {
		await createNotification({
			recipient: post.userId._id,
			sender: _id,
			type: "share",
			post: post._id,
		});
	}

	res.status(200).json({ status: "success", data: sharePO });
});

const deleteShare = errorHandler(async (req, res, next) => {
	const postId = req.params.id; //post id
	const _id = req.user._id; //user id
	const sharePO = await Share.findOneAndDelete({
		userId: _id,
		sharePost: postId,
	});
	if (!sharePO) {
		const error = appError.Error("not deleted", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: sharePO });
});

const updateShare = errorHandler(async (req, res, next) => {
	const postId = req.params.id; //post id
	const _id = req.user._id; //user id
	const sharePO = await Share.findOneAndUpdate(
		{ userId: _id, sharePost: postId },
		req.body,
		{ new: true }
	);
	if (!sharePO) {
		const error = appError.Error("not updated", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: sharePO });
});

const singleShare = errorHandler(async (req, res, next) => {
	const postId = req.params.id; //post id
	const _id = req.user._id; //user id
	const sharePO = await Share.findOne({ userId: _id, sharePost: postId });
	if (!sharePO) {
		const error = appError.Error("not founded", "fail", 404);
		return next(error);
	}
	res.status(200).json({ status: "success", data: sharePO });
});

export { sharePost, deleteShare, updateShare, singleShare };
