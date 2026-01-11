import { User } from "../../features/auth/user.model.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

const user = async (req, res, next) => {
	let token;
	if (req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		const error = new AppError("token is required", "fail", 401);
		return next(error);
	}

	try {
		const verifyToken = jwt.verify(token, process.env.USER_KEY_TOKEN);
		const userData = await User.findById(verifyToken.id);
		if (!userData) {
			const error = new AppError("user not found", "fail", 401);
			return next(error);
		}
		req.user = userData;
		next();
	} catch (e) {
		const error = new AppError("invalid token", "fail", 401);
		return next(error);
	}
};

const allowTo = (...roles) => {
	return async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			const error = new AppError("you not authorize", "fail", 401);
			return next(error);
		}
		next();
	};
};

const optionalUser = async (req, res, next) => {
	let token;
	console.log("optionalUser: Cookies received:", req.cookies);
	if (req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		console.log("optionalUser: No token found in cookies");
		return next();
	}

	try {
		const verifyToken = jwt.verify(token, process.env.USER_KEY_TOKEN);
		console.log("optionalUser: Token verified, ID:", verifyToken.id);
		const userData = await User.findById(verifyToken.id);
		if (userData) {
			console.log(
				"optionalUser: User found and attached to req.user:",
				userData._id,
				userData.firstName,
				userData.lastName
			);
			req.user = userData;
		} else {
			console.log(
				"optionalUser: Token valid but user NOT found in DB for ID:",
				verifyToken.id
			);
		}
		next();
	} catch (e) {
		console.log("optionalUser: Invalid token error:", e.message);
		next();
	}
};

export { user, allowTo, optionalUser };
