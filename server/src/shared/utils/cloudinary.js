import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret,
	secure: process.env.secure === "true",
});

export { cloudinary };
