import "dotenv/config";
import { Server } from "socket.io";

const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const isDev = process.env.NODE_ENV === "development";

const io = new Server({
	cors: {
		origin: [clientUrl, "http://localhost:3000", "http://localhost:5173"],
		methods: ["GET", "POST"],
	},
});

let onLineUsers = [];

io.on("connection", (socket) => {
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

io.listen(port);
if (isDev) console.log(`Socket.io server running on port ${port}`);
