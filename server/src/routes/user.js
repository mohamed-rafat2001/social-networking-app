const express = require("express");
const router = express.Router();
const auth = require("../middelwares/auth");

const handelValidation = require("../middelwares/handelValidation");
const {
	regestrationValidator,
	fileValidation,
} = require("../validations/validations");

const fileUpload = require("../utils/multer");
const {
	singUp,
	profileImg,
	login,
	profile,
	updateProfile,
	deleteAcount,
	forgotPass,
	resetPassword,
	user,
} = require("../controller/user");
//signUp
router.post("/signup", regestrationValidator, handelValidation(), singUp);
// upload user image
router.post(
	"/profileImg",
	auth.user,
	fileUpload(fileValidation.image).single("avatar"),
	profileImg
);
//login
router.post(
	"/login",
	regestrationValidator[2],
	regestrationValidator[3],
	handelValidation(),
	login
);

router
	.route("/profile")
	//user profile
	.get(auth.user, profile)
	//update user profile
	.patch(auth.user, updateProfile)
	// delete acount
	.delete(auth.user, deleteAcount);
//forgot password
router.post("/forgotPassword", forgotPass);
//reset password
router.patch("/resetPassword", resetPassword);
router.get("/user", auth.user, user);
router.get("/:userId", auth.user, user); // Add this line to handle specific user lookup
module.exports = router;
