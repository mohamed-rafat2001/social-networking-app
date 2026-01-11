import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

// Features
import { userRouter } from "./src/features/auth/auth.routes.js";
import { followRouter } from "./src/features/follow/follow.routes.js";
import { blockRouter } from "./src/features/block/block.routes.js";
import { adminRouter } from "./src/features/admin/admin.routes.js";
import { postsRouter } from "./src/features/posts/posts.routes.js";
import { youtubeRouter } from "./src/features/youtube/youtube.routes.js";
import { commentRouter } from "./src/features/posts/comment.routes.js";
import { replayRouter } from "./src/features/posts/replay.routes.js";
import { shareRouter } from "./src/features/posts/sharePost.routes.js";
import { chatRouter } from "./src/features/chat/chat.routes.js";
import { messageRouter } from "./src/features/chat/message.routes.js";
import { notificationRouter } from "./src/features/notifications/notification.routes.js";

import { globalErrorHandler } from "./src/shared/middlewares/errorHandler.js";
import "./src/shared/db/mongoose.db.js";

import { AppError } from "./src/shared/utils/appError.js";

export const app = express();

// 1) SECURITY MIDDLEWARES
// Relaxed security for serverless to prevent startup timeouts
app.use(
	helmet({
		crossOriginResourcePolicy: false,
		contentSecurityPolicy: false,
	})
);

// CORS - Explicit configuration for your Netlify domains
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:3000",
	"https://social-networking-app.netlify.app",
	process.env.CLIENT_URL,
].filter(Boolean);

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new AppError("Not allowed by CORS", 403));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Range",
		],
		exposedHeaders: ["Content-Range", "Accept-Ranges"],
	})
);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Health check for Netlify to see if the function is alive
app.get("/ping", (req, res) => res.send("pong"));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/blocks", blockRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/youtube", youtubeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/replays", replayRouter);
app.use("/api/v1/shares", shareRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);

app.all("*", (req, res, next) => {
	res.status(404).json({
		status: "fail",
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
