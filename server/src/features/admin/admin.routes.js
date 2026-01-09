import express from "express";
import * as adminController from "./admin.controller.js";
import {
	user as protect,
	allowTo,
} from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

// get all admins
router.get("/allAdmins", protect, allowTo("admin"), adminController.Admins);

// get all users
router.get("/allUsers", protect, allowTo("admin"), adminController.Users);

//get single user
router.get("/user", protect, allowTo("admin"), adminController.singleUser);

//delete user
router.delete(
	"/user/:id",
	protect,
	allowTo("admin"),
	adminController.deleteUser
);

//block && unBlock user
router.patch(
	"/blockUser/:id",
	protect,
	allowTo("admin"),
	adminController.blockAndUnblock
);

export default router;
