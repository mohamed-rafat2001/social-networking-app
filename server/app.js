import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// Features
import userRouter from "./src/features/auth/auth.routes.js";
import followRouter from "./src/features/follow/follow.routes.js";
import blockRouter from "./src/features/block/block.routes.js";
import adminRouter from "./src/features/admin/admin.routes.js";
import postsRouter from "./src/features/posts/posts.routes.js";
import youtubeRouter from "./src/features/youtube/youtube.routes.js";
import commentRouter from "./src/features/posts/comment.routes.js";
import replayRouter from "./src/features/posts/replay.routes.js";
import shareRouter from "./src/features/posts/sharePost.routes.js";
import chatRouter from "./src/features/chat/chat.routes.js";
import messageRouter from "./src/features/chat/message.routes.js";
import notificationRouter from "./src/features/notifications/notification.routes.js";

import { globalErrorHandler } from "./src/shared/middlewares/errorHandler.js";

const app = express();

mongoose.set("strictQuery", true);

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
// Apply to all routes
app.use(limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:3000",
			process.env.CLIENT_URL,
		].filter(Boolean),
		credentials: true,
	})
);

app.use("/user", userRouter);
app.use("/follows", followRouter);
app.use("/blocks", blockRouter);
app.use("/admin", adminRouter);
app.use("/posts", postsRouter);
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

// Global Error Handler
app.use(globalErrorHandler);

export default app;
