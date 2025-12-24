const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URL);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		// Attempt to connect to local default if the specific URL fails
		if (
			process.env.MODE === "DEV" &&
			!process.env.DB_URL.includes("127.0.0.1")
		) {
			try {
				console.log("Attempting to connect to local MongoDB default...");
				await mongoose.connect("mongodb://127.0.0.1:27017/social-app");
				console.log("Connected to local MongoDB default.");
			} catch (localError) {
				console.error("Failed to connect to local MongoDB as well.");
			}
		}
	}
};

connectDB();
