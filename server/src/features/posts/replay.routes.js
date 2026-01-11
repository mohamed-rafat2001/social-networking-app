import express from "express";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import { fileUpload } from "../../shared/utils/multer.js";
import {
	fileValidation,
	replayValidator,
} from "../../shared/validations/validations.js";
import * as replayController from "./replay.controller.js";
import { handelValidation } from "../../shared/middlewares/handelValidation.js";

const router = express.Router();

router
	.route("/replay/:id")
	//add replay
	.post(
		protect,
		fileUpload(fileValidation.image).single("file"),
		replayValidator,
		handelValidation(),
		replayController.addReplay
	)
	// single replay
	.get(protect, replayController.singleReplay)
	//update replay
	.patch(
		protect,
		replayValidator,
		handelValidation(),
		replayController.updateReplay
	)
	//deleteReplay
	.delete(protect, replayController.deleteReplay);

// likeOnReplay
router.patch("/replay/like/:id", protect, replayController.likeOnReplay);

// dislike for post
router.patch("/replay/disLike/:id", protect, replayController.disLikeReplay);

export { router as replayRouter };
