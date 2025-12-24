const express = require("express");
const router = express.Router();
const auth = require("../middelwares/auth");
const fileUpload = require("../utils/multer");
const { fileValidation } = require("../validations/validations");

const {
	addComment,
	singleComment,
	updateComment,
	deleteComment,
	likeOnComm,
	disLikeComm,
} = require("../controller/comments");

router
	.route("/comment/:id")
	// add comment
	.post(auth.user, fileUpload(fileValidation.image).single("file"), addComment)
	// single comment
	.get(auth.user, singleComment)
	//update comment
	.patch(auth.user, updateComment)
	//delete comment
	.delete(auth.user, deleteComment);
// like comment
router.patch("/comment/like/:id", auth.user, likeOnComm);
// dislike for post
router.patch("/comment/disLike/:id", auth.user, disLikeComm);
module.exports = router;
