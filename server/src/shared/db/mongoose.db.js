import mongoose from "mongoose";

export const connectDB = async () => {
	const dbUrl = process.env.DB_URL;
	const isDev = process.env.NODE_ENV === "development";

	if (!dbUrl && !isDev) {
		const errorMsg = "DB_URL is not defined in production environment!";
		console.error(errorMsg);
		process.exit(1);
	}

	try {
		let finalUrl = dbUrl || "mongodb://127.0.0.1:27017/social-app";

		if (process.env.DB_PASSWORD && finalUrl.includes("<db_password>")) {
			finalUrl = finalUrl.replace("<db_password>", process.env.DB_PASSWORD);
		}

		mongoose.set("strictQuery", false);
		await mongoose.connect(finalUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
		});
		console.log("MongoDB Connected successfully");
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);

		// Fallback for local development only
		if (isDev) {
			try {
				console.log("Attempting local fallback...");
				await mongoose.connect("mongodb://127.0.0.1:27017/social-app", {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});
				console.log("Connected to local MongoDB");
			} catch (fallbackError) {
				console.error("Local fallback failed.");
				process.exit(1);
			}
		} else {
			process.exit(1);
		}
	}
};
