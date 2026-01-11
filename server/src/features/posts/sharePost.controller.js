import { Share } from "./sharePost.model.js";
import { Posts } from "./posts.model.js";
import { catchAsync } from "../../shared/middlewares/errorHandler.js";
import { AppError } from "../../shared/utils/appError.js";
import { cloudinary } from "../../shared/utils/cloudinary.js";
import { createNotification } from "../notifications/notification.controller.js";
import * as factory from "../../shared/utils/handlerFactory.js";

const sharePost = catchAsync(async (req, res, next) => {
	let postId = req.params.id;
	const userId = req.user._id;

	if (!postId) {
		return next(new AppError("Post ID is required", "fail", 400));
	}

	// 1. Try to see if it's already a share, if so, get the original post ID
	try {
		const share = await Share.findById(postId);
		if (share) {
			postId = share.sharePost;
		}
	} catch (err) {
		// If it's a CastError, it's just not a Share, continue with original postId
	}

	// 2. Check if the original post exists
	const originalPost = await Posts.findById(postId);
	if (!originalPost) {
		return next(new AppError("Original post not found", "fail", 404));
	}

	// 3. Check if user already shared this original post
	const existingShare = await Share.findOne({ userId, sharePost: postId });

	if (existingShare) {
		// Update note if provided
		if (req.body.note !== undefined) {
			existingShare.note = req.body.note;
			await existingShare.save();
			return res.status(200).json({ status: "success", data: existingShare });
		}
		return res.status(200).json({ status: "success", data: existingShare });
	}

	// 4. Handle new share creation
	let sharePO;
	const shareData = {
		...req.body,
		userId,
		sharePost: postId,
	};

	if (req.files && req.files.length > 0) {
		const files = [];
		for (const file of req.files) {
			const { public_id, secure_url } = await cloudinary.uploader.upload(
				file.path,
				{ folder: `social-app/user/id_${userId}/share/postId_${postId}` }
			);
			files.push({ public_id, secure_url });
		}
		shareData.image = files;
	}

	sharePO = new Share(shareData);

	if (!sharePO) {
		return next(new AppError("Failed to create share object", "fail", 400));
	}

	// 5. Save share and update original post
	await sharePO.save();

	await Posts.findByIdAndUpdate(
		postId,
		{
			$push: { shares: { shareId: sharePO._id, userId } },
		},
		{ new: true }
	);

	// 6. Notification logic
	const postWithAuthor = await Posts.findById(postId).populate("userId");
	if (
		postWithAuthor &&
		postWithAuthor.userId?._id.toString() !== userId.toString()
	) {
		await createNotification({
			recipient: postWithAuthor.userId._id,
			sender: userId,
			type: "share",
			post: postWithAuthor._id,
		});
	}

	// Emit socket event for new share
	const io = req.app.get("io");
	if (io) {
		io.emit("newPost", {
			type: "share",
			shareId: sharePO._id,
			userId: userId,
		});
	}

	res.status(201).json({ status: "success", data: sharePO });
});

const deleteShare = catchAsync(async (req, res, next) => {
	const postId = req.params.id; //post id
	const userId = req.user._id; //user id

	const sharePO = await Share.findOne({
		userId,
		sharePost: postId,
	});

	if (!sharePO) {
		const error = new AppError("Share not found", "fail", 404);
		return next(error);
	}

	// Remove from original post's shares array
	await Post.findByIdAndUpdate(postId, {
		$pull: { shares: { shareId: sharePO._id } },
	});

	await sharePO.deleteOne();

	res.status(200).json({ status: "success", data: sharePO });
});

const updateShare = factory.updateOne(Share);
const singleShare = factory.getOne(Share, { path: "sharePost" });

export { sharePost, deleteShare, updateShare, singleShare };
