import { AppError } from "../utils/appError.js";

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	let value = "";
	if (err.errmsg) {
		const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
		value = match ? match[0] : "unknown";
	} else if (err.keyValue) {
		value = JSON.stringify(err.keyValue);
	} else {
		value = "unknown";
	}
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
	new AppError("Your token has expired! Please log in again.", 401);

/**
 * catchAsync: Wrapper to catch errors in async express routes
 */
export const catchAsync = (asyncFn) => {
	return (req, res, next) => {
		asyncFn(req, res, next).catch((err) => next(err));
	};
};

/**
 * globalErrorHandler: Global error handling middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || err.code || 500;
	err.status = err.status || "error";

	// Ensure statusCode is a valid HTTP status code
	if (
		typeof err.statusCode !== "number" ||
		err.statusCode < 100 ||
		err.statusCode > 599
	) {
		err.statusCode = 500;
	}

	if (process.env.NODE_ENV === "development") {
		// Development: Send full error details
		res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	} else {
		// Production: Hide sensitive details
		let error = { ...err };
		error.message = err.message;
		error.name = err.name;
		error.code = err.code;

		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJWTError();
		if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

		// If operational, send friendly message. Otherwise send generic message.
		if (error.isOperational) {
			res.status(error.statusCode).json({
				status: error.status,
				message: error.message,
			});
		} else {
			// Programming or other unknown errors: don't leak error details
			console.error("ERROR 💥", err);
			res.status(500).json({
				status: "error",
				message: error.message || "Something went very wrong!",
				// Temporarily include error name for debugging in production
				errorType: error.name,
			});
		}
	}
};
