import express from "express";
import * as chatController from "./chat.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", chatController.createChat);
router.get("/", chatController.findUserChats);
router.get("/:id", chatController.findChat);
router.delete("/:id", chatController.deleteChat);

export { router as chatRouter };
