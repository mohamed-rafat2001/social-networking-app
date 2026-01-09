import { Server } from "socket.io";
const io = new Server({ cors: "http://localhost:3000" });
let onLineUsers = [];
io.on("connection", (socket) => {
	console.log("new connection", socket.id);
	socket.on("addUser", (userId) => {
		!onLineUsers.some((user) => user.userId === userId) &&
			onLineUsers.push({
				userId,
				socketId: socket.id,
			});

		io.emit("getUsersOnLine", onLineUsers);
	});
	socket.on("sendMessage", ({ newMessage, userId }) => {
		const user = onLineUsers.find((user) => user.userId === userId);
		if (user) {
			console.log("Sending message to:", userId);

			io.to(user.socketId).emit("getMessage", newMessage);
			io.to(user.socketId).emit("notification", {
				senderId: newMessage.data.senderId,
				chatId: newMessage.data.chatId,
				text: newMessage.data.text,
				isRead: false,
			});
		}
	});

	// Handle general notifications (likes, comments, etc.)
	socket.on("sendNotification", ({ recipientId, notification }) => {
		const user = onLineUsers.find((user) => user.userId === recipientId);
		if (user) {
			io.to(user.socketId).emit("getNotification", notification);
		}
	});
	socket.on("disconnect", () => {
		onLineUsers = onLineUsers.filter((user) => user.socketId !== socket.id);
		io.emit("getUsersOnLine", onLineUsers);
		// console.log(onLineUsers)
	});
});

io.listen(5000);
