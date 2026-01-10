import express from "express";
import * as postsController from "./posts.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import {
	fileValidation,
	postValidator,
} from "../../shared/validations/validations.js";
import handelValidation from "../../shared/middlewares/handelValidation.js";

const router = express.Router();

router.use(protect);

router
	.route("/")
	.get(postsController.allPosts)
	.post(
		fileUpload(fileValidation.image).array("fileUp", 10),
		postValidator,
		handelValidation(),
		postsController.addPost
	);

router.get("/user", postsController.postsForUser);

router
	.route("/:id")
	.get(postsController.singlePost)
	.patch(postValidator, handelValidation(), postsController.updatePost)
	.delete(postsController.deletePost);

router.post("/:id/like", postsController.likeOnPost);
router.post("/:id/unlike", postsController.unLikeOnPost);
router.patch("/:id/increment-view", postsController.incrementView);

export default router;
