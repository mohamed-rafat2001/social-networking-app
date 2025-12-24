const express = require("express");
const router = express.Router();
const auth = require("../middelwares/auth");
const fileUpload = require("../utils/multer");
const {
	addPost,
	singlePost,
	updatePost,
	deletePost,
	allPosts,
	postsForUser,
	likeOnPost,
	unLikeOnPost,
} = require("../controller/posts");
const { fileValidation } = require("../validations/validations");

// add post
router.post(
	"/post",
	auth.user,
	fileUpload(fileValidation.image).array("filess", 12),
	addPost
);

router
	.route("/post/:id")
	// get single post
	.get(auth.user, singlePost)
	//update post
	.patch(auth.user, updatePost)
	//delete post
	.delete(auth.user, deletePost);
//gett all posts
router.get("/posts", auth.user, allPosts);
//get all posts for single user
router.get("/userPosts", auth.user, postsForUser);

//post like
router.patch("/post/like/:id", auth.user, likeOnPost);
//post unlike
router.patch("/post/unLike/:id", auth.user, unLikeOnPost);
module.exports = router;
