export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Compatibility wrapper for existing usage: AppError.Error(msg, status, code)
 */
AppError.Error = (message, status, code) => {
	return new AppError(message, code);
};
