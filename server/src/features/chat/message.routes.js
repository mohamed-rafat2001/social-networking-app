import express from "express";
import * as messageController from "./message.controller.js";
import { user as protect } from "../../shared/middlewares/auth.middleware.js";
import fileUpload from "../../shared/utils/multer.js";
import { fileValidation } from "../../shared/validations/validations.js";

const router = express.Router();

router.use(protect);

router
	.route("/:id")
	.post(
		fileUpload(fileValidation.image).array("file", 10),
		messageController.createMessage
	)
	.get(messageController.ChatMessages)
	.delete(messageController.deleteAllMessagesFromChat);

router.delete("/delete/:id", messageController.deleteMessage);
router.patch("/update/:id", messageController.updateMessage);
router.patch("/read/:id", messageController.markMessagesAsRead);

export default router;
