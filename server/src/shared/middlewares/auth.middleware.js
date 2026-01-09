import User from "../../features/auth/user.model.js";
import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";

const user = async (req, res, next) => {
	const authToken = req.header("Authorization");
	if (!authToken) {
		const error = appError.Error("token is required", "fail", 401);
		return next(error);
	}
	const token = authToken.replace("Bearer ", "");
	try {
		const verifyToken = jwt.verify(token, process.env.USER_KEY_TOKEN);
		const userData = await User.findById(verifyToken.id);
		if (!userData) {
			const error = appError.Error("user not found", "fail", 401);
			return next(error);
		}
		req.user = userData;
		next();
	} catch (e) {
		const error = appError.Error("invalid token", "fail", 401);
		return next(error);
	}
};

const allowTo = (...roles) => {
	return async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			const error = appError.Error("you not authorize", "fail", 401);
			return next(error);
		}
		next();
	};
};

export { user, allowTo };
