import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

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
	process.env.CLIENT_URL,
].filter(Boolean);

app.use(
	cors({
		origin: function (origin, callback) {
			// In development, allow all origins
			if (process.env.NODE_ENV !== "production") {
				return callback(null, true);
			}

			// allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);

			// Check if origin is allowed
			const isAllowed = allowedOrigins.some((allowed) => {
				if (allowed === origin) return true;
				// Handle potential trailing slashes
				if (allowed.replace(/\/$/, "") === origin.replace(/\/$/, ""))
					return true;
				return false;
			});

			if (isAllowed) {
				callback(null, true);
			} else {
				console.log("Origin not allowed by CORS:", origin);
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

// Handle preflight requests for all routes
app.options("*", cors());

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
	max: 100, // Limit each IP to 100 requests per windowMs
	windowMs: 60 * 60 * 1000, // 1 hour
	message: "Too many requests from this IP, please try again in an hour!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all API routes
app.use("/api", limiter);

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Health check for Netlify to see if the function is alive
app.get("/ping", (req, res) => res.send("pong"));

// Root route for deployment health checks
app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "EngiConnect API is running",
	});
});

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
	if (req.originalUrl.startsWith("/socket.io")) {
		return next();
	}
	res.status(404).json({
		status: "fail",
		message: `Can't find ${req.originalUrl} on this server!`,
	});
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
