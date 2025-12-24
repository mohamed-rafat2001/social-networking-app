const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
const userRouter = require("./src/routes/user.js");
const adminRouter = require("./src/routes/admin.js");
const postsRouter = require("./src/routes/posts.js");
const youtubeRouter = require("./src/routes/youtube.js");
const commentRouter = require("./src/routes/comment.js");
const replayRouter = require("./src/routes/replay.js");
const shareRouter = require("./src/routes/sharePost.js");
const chatRouter = require("./src/routes/chat.js");
const messageRouter = require("./src/routes/message.js");

app.use(userRouter);
app.use(adminRouter);
app.use(postsRouter);
app.use(youtubeRouter);
app.use(commentRouter);
app.use(replayRouter);
app.use(shareRouter);
app.use(chatRouter);
app.use(messageRouter);

app.all("*", (req, res, next) => {
	res.status(500).json({ status: "fail", message: "this route not defined" });
});
app.use((error, req, res, next) => {
	if (process.env.MODE == "DEV") {
		return res.status(error.code || 500).json({
			status: "error",
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
	}
	res
		.status(error.code || 500)
		.json({ status: "error", message: error.message, code: error.code });
});
require("./src/db/mongoose.js");

module.exports = app;
