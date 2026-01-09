import express from "express";
import * as followController from "./follow.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/follow/:userId", followController.followUser);
router.post("/unfollow/:userId", followController.unfollowUser);
router.get("/followers/:userId?", followController.getFollowers);
router.get("/following/:userId?", followController.getFollowing);

export default router;
