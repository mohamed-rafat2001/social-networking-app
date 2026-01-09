import express from "express";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import { fileValidation } from "../../shared/validations/validations.js";
import * as commentController from "./comment.controller.js";

const router = express.Router();

// like comment
router.patch("/like/:id", protect, commentController.likeOnComm);

// dislike for post
router.patch("/disLike/:id", protect, commentController.disLikeComm);

// get all comments for a post
router.get("/post/:id", protect, commentController.postComments);

router
	.route("/:id")
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

export default router;
