process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	process.exit(1);
});

import "dotenv/config";
import http from "http";
import { app } from "./app.js";
import { initSocket } from "./src/shared/utils/socket.js";

const port = process.env.PORT || 4000;
const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

const server = httpServer.listen(port, () =>
	console.log(`server running on port ${port}`)
);

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
