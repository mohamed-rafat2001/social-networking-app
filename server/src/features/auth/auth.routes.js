import express from "express";
import * as authController from "./auth.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import handelValidation from "../../shared/middlewares/handelValidation.js";
import {
	regestrationValidator,
	fileValidation,
} from "../../shared/validations/validations.js";
import fileUpload from "../../shared/utils/multer.js";

const router = express.Router();

// Public routes
router.post(
	"/signup",
	regestrationValidator,
	handelValidation(),
	authController.signUp
);
router.post(
	"/login",
	regestrationValidator[2],
	regestrationValidator[3],
	handelValidation(),
	authController.login
);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPass);
router.patch("/resetPassword", authController.resetPassword);

// Protected routes
router.use(protect);

router.post(
	"/profileImg",
	fileUpload(fileValidation.image).single("avatar"),
	authController.profileImg
);
router.delete("/profileImg", authController.deleteProfileImg);

router.get("/search", authController.searchUsers);

router
	.route("/profile")
	.get(authController.profile)
	.patch(authController.updateProfile)
	.delete(authController.deleteAcount);

router.get("/user", authController.user);
router.get("/:userId", authController.user);

export default router;
