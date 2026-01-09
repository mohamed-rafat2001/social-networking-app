import express from "express";
import * as postsController from "./posts.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import { fileValidation } from "../../shared/validations/validations.js";

const router = express.Router();

router.use(protect);

router
	.route("/")
	.get(postsController.allPosts)
	.post(
		fileUpload(fileValidation.image).array("fileUp", 10),
		postsController.addPost
	);

router.get("/user", postsController.postsForUser);

router
	.route("/:id")
	.get(postsController.singlePost)
	.patch(postsController.updatePost)
	.delete(postsController.deletePost);

router.post("/:id/like", postsController.likeOnPost);
router.post("/:id/unlike", postsController.unLikeOnPost);
router.patch("/:id/increment-view", postsController.incrementView);

export default router;
