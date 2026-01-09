import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Features
import userRouter from "./src/features/auth/auth.routes.js";
import followRouter from "./src/features/auth/follow.routes.js";
import adminRouter from "./src/features/admin/admin.routes.js";
import postsRouter from "./src/features/posts/posts.routes.js";
import youtubeRouter from "./src/features/youtube/youtube.routes.js";
import commentRouter from "./src/features/posts/comment.routes.js";
import replayRouter from "./src/features/posts/replay.routes.js";
import shareRouter from "./src/features/posts/sharePost.routes.js";
import chatRouter from "./src/features/chat/chat.routes.js";
import messageRouter from "./src/features/chat/message.routes.js";
import notificationRouter from "./src/features/notifications/notification.routes.js";

const app = express();

mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all for development, refine later

app.use("/user", userRouter);
app.use("/follows", followRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter); // Changed from / to /posts for clarity
app.use("/youtube", youtubeRouter);
app.use("/comments", commentRouter);
app.use("/replays", replayRouter);
app.use("/shares", shareRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);

// Database Connection
import "./src/shared/db/mongoose.db.js";

app.all("*", (req, res, next) => {
	res.status(404).json({ status: "fail", message: "this route not defined" });
});

app.use((error, req, res, next) => {
	console.error("Error occurred:", error);

	// Handle Multer errors
	if (error.name === "MulterError") {
		return res.status(400).json({
			status: "fail",
			message: `Upload error: ${error.message}`,
			code: 400,
		});
	}

	let statusCode = error.code || error.statusCode || 500;
	if (typeof statusCode !== "number" || statusCode < 100 || statusCode > 599) {
		statusCode = 500;
	}
	const message = error.message || "Internal Server Error";

	if (process.env.MODE === "DEV") {
		return res.status(statusCode).json({
			status: "error",
			message: message,
			code: statusCode,
			stack: error.stack,
		});
	}
	res.status(statusCode).json({
		status: "error",
		message: message,
		code: statusCode,
	});
});

export default app;
