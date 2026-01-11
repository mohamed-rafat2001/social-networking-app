import { Server } from "socket.io";

let io;
let onLineUsers = [];

export const initSocket = (server) => {
	io = new Server(server, {
		path: "/socket.io/",
		cors: {
			origin: function (origin, callback) {
				const allowedOrigins = [
					"http://localhost:5173",
					"http://localhost:3000",
					"https://social-networking-app.netlify.app",
					process.env.CLIENT_URL,
				].filter(Boolean);

				if (process.env.NODE_ENV !== "production") {
					return callback(null, true);
				}

				if (!origin || allowedOrigins.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error("Not allowed by CORS"));
				}
			},
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		const isDev = process.env.NODE_ENV === "development";
		if (isDev) console.log("New socket connection established:", socket.id);

		socket.on("addUser", (userId) => {
			if (userId && !onLineUsers.some((user) => user.userId === userId)) {
				onLineUsers.push({
					userId,
					socketId: socket.id,
				});
			}
			io.emit("getUsersOnLine", onLineUsers);
		});

		socket.on("sendMessage", ({ newMessage, userId }) => {
			const user = onLineUsers.find((user) => user.userId === userId);
			if (user) {
				io.to(user.socketId).emit("getMessage", newMessage);
				io.to(user.socketId).emit("notification", {
					senderId: newMessage.senderId,
					chatId: newMessage.chatId,
					content: newMessage.content,
					isRead: false,
				});
			}
		});

		socket.on("sendNotification", ({ recipientId, notification }) => {
			const user = onLineUsers.find((user) => user.userId === recipientId);
			if (user) {
				io.to(user.socketId).emit("getNotification", notification);
			}
		});

		socket.on("error", (err) => {
			if (isDev) console.error("Socket error:", err);
		});

		socket.on("disconnect", () => {
			onLineUsers = onLineUsers.filter((user) => user.socketId !== socket.id);
			io.emit("getUsersOnLine", onLineUsers);
			if (isDev) console.log("Socket disconnected:", socket.id);
		});
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};
