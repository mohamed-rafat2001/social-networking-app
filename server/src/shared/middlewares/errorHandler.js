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
		// If operational, send friendly message. Otherwise send generic message.
		if (err.isOperational) {
			res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		} else {
			// Programming or other unknown errors: don't leak error details
			console.error("ERROR 💥", err);
			res.status(500).json({
				status: "error",
				message: "Something went very wrong!",
			});
		}
	}
};
