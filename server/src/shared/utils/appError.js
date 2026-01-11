export class AppError extends Error {
	constructor(message, statusCodeOrStatus, statusCodeOnly) {
		super(message);

		// Support (message, statusCode) OR (message, status, statusCode)
		if (statusCodeOnly) {
			this.statusCode = statusCodeOnly;
			this.status = statusCodeOrStatus;
		} else {
			this.statusCode = statusCodeOrStatus;
			this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
		}

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
