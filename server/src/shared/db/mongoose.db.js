import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// Try connecting to 127.0.0.1 first
		const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/social-app";
		const conn = await mongoose.connect(dbUrl);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB (127.0.0.1): ${error.message}`);

		// Fallback to localhost (IPv6 vs IPv4 issue common in Node.js 17+)
		try {
			console.log("Attempting fallback to localhost...");
			const conn = await mongoose.connect(
				"mongodb://localhost:27017/social-app"
			);
			console.log(`MongoDB Connected via localhost: ${conn.connection.host}`);
		} catch (fallbackError) {
			console.error(
				`Error connecting to MongoDB (localhost): ${fallbackError.message}`
			);
			console.log("\n--- TROUBLESHOOTING ---");
			console.log("1. Ensure MongoDB is installed.");
			console.log(
				"2. Run 'Start-Service MongoDB' in an Administrator PowerShell."
			);
			console.log("3. If using MongoDB Atlas, update DB_URL in .env file.");
			console.log("------------------------\n");
		}
	}
};

connectDB();
