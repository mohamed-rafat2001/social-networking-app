const express = require("express");
const router = express.Router();
const auth = require("../middelwares/auth");
const fileUpload = require("../utils/multer");
const { fileValidation } = require("../validations/validations");

const {
	sharePost,
	deleteShare,
	updateShare,
	singleShare,
} = require("../controller/sharePost");

router
	.route("/sharePost/:id")
	//share post
	.post(
		auth.user,
		fileUpload(fileValidation.image).array("files", 12),
		sharePost
	)
	//delete share post
	.delete(auth.user, deleteShare)
	//updateShare
	.patch(auth.user, updateShare)
	//singleShare
	.get(auth.user, singleShare);

module.exports = router;
