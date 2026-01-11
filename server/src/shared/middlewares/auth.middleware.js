import User from "../../features/auth/user.model.js";
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

export { user, allowTo };
