import mongoose from "mongoose";

const connectDB = async () => {
	const dbUrl = process.env.DB_URL;
	const isDev = process.env.NODE_ENV === "development";

	if (!dbUrl && !isDev) {
		console.error("DB_URL is not defined in production environment!");
		return;
	}

	try {
		let finalUrl = dbUrl || "mongodb://127.0.0.1:27017/social-app";

		if (process.env.DB_PASSWORD && finalUrl.includes("<db_password>")) {
			finalUrl = finalUrl.replace("<db_password>", process.env.DB_PASSWORD);
		}

		await mongoose.connect(finalUrl);
		console.log("MongoDB Connected successfully");
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);

		// Fallback for local development only
		if (isDev && dbUrl) {
			try {
				console.log("Attempting local fallback...");
				await mongoose.connect("mongodb://127.0.0.1:27017/social-app");
				console.log("Connected to local MongoDB");
			} catch (fallbackError) {
				console.error("Local fallback failed.");
			}
		}
	}
};

connectDB();
