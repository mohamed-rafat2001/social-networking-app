import express from "express";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import { fileValidation } from "../../shared/validations/validations.js";
import * as commentController from "./comment.controller.js";

const router = express.Router();

router
	.route("/comment/:id")
	// add comment
	.post(
		protect,
		fileUpload(fileValidation.image).single("file"),
		commentController.addComment
	)
	// single comment
	.get(protect, commentController.singleComment)
	//update comment
	.patch(protect, commentController.updateComment)
	//delete comment
	.delete(protect, commentController.deleteComment);

// like comment
router.patch("/comment/like/:id", protect, commentController.likeOnComm);

// dislike for post
router.patch("/comment/disLike/:id", protect, commentController.disLikeComm);

export default router;
