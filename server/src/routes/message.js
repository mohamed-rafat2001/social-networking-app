const express = require("express");
const router = express.Router();
const auth = require("../middelwares/auth");
const fileUpload = require("../utils/multer");

const {
	createMessage,

	deleteMessage,
	deleteAllMessagesFromChat,
	ChatMessages,
} = require("../controller/message");
const { fileValidation } = require("../validations/validations");
router
	.route("/message/:id")
	.post(
		auth.user,
		fileUpload(fileValidation.image).array("files", 12),
		createMessage
	)
	.delete(auth.user, deleteMessage)
	.get(auth.user, ChatMessages);
router.delete("/message/delete/:id", auth.user, deleteAllMessagesFromChat);

module.exports = router;
