import express from "express";
import * as postsController from "./posts.controller.js";
import {
	user as protect,
	optionalUser,
} from "../../shared/middlewares/auth.middleware.js";
import { fileUpload } from "../../shared/utils/multer.js";
import {
	fileValidation,
	postValidator,
} from "../../shared/validations/validations.js";
import { handelValidation } from "../../shared/middlewares/handelValidation.js";

const router = express.Router();

// Debug middleware for posts
router.use((req, res, next) => {
	console.log(`Posts Route: ${req.method} ${req.originalUrl}`);
	next();
});

router
	.route("/")
	.get(optionalUser, postsController.allPosts)
	.post(
		protect,
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

router.post("/:id/like", protect, postsController.likeOnPost);
router.post("/:id/unlike", protect, postsController.unLikeOnPost);
router.patch("/:id/increment-view", postsController.incrementView);

export { router as postsRouter };
