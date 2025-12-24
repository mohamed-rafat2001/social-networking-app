const express = require("express");
const router = express.Router();
const User = require("../models/user");
const fileUpload = require("../utils/multer");
const { fileValidation } = require("../validations/validations");

const auth = require("../middelwares/auth");
const {
	addReplay,
	singleReplay,
	updateReplay,
	deleteReplay,
	likeOnReplay,
	disLikeOnReplay,
} = require("../controller/replay");

router
	.route("/replay/:id")
	//add replay
	.post(auth.user, fileUpload(fileValidation.image).single("file"), addReplay)
	// single replay
	.get(auth.user, singleReplay)
	//update replay
	.patch(auth.user, updateReplay)
	//deleteReplay
	.delete(auth.user, deleteReplay);
// likeOnReplay
router.patch("/replay/like/:id", auth.user, likeOnReplay);
// dislike for post
router.patch("/replay/disLike/:id", auth.user, disLikeOnReplay);
module.exports = router;
