import express from "express";
import * as blockController from "./block.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/block/:userId", blockController.blockUser);
router.post("/unblock/:userId", blockController.unblockUser);
router.get("/", blockController.getBlockedUsers);

export default router;
