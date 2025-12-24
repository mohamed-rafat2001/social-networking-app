const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/social-app";
		const conn = await mongoose.connect(dbUrl);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
	}
};

connectDB();
