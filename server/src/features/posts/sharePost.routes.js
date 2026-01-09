import express from "express";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import { fileValidation } from "../../shared/validations/validations.js";
import * as sharePostController from "./sharePost.controller.js";

const router = express.Router();

router
	.route("/sharePost/:id")
	//share post
	.post(
		protect,
		fileUpload(fileValidation.image).array("files", 12),
		sharePostController.sharePost
	)
	//delete share post
	.delete(protect, sharePostController.deleteShare)
	//updateShare
	.patch(protect, sharePostController.updateShare)
	//singleShare
	.get(protect, sharePostController.singleShare);

export default router;
