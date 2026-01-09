import { validationResult } from "express-validator";

const handelValidation = () => {
	return (req, res, next) => {
		const result = validationResult(req);
		if (result.errors.length) {
			return res.status(400).json({
				status: "error",
				message: "validation err",
				validation: result.errors,
			});
		}
		next();
	};
};

export default handelValidation;
