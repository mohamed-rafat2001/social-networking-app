class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Compatibility wrapper for existing usage: appError.Error(msg, status, code)
 * Note: It's better to use 'new AppError(message, statusCode)' directly.
 */
const appErrorLegacy = {
	Error: (message, status, code) => {
		return new AppError(message, code);
	},
};

export { AppError };
export default appErrorLegacy;
