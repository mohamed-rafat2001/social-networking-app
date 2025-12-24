const { body } = require("express-validator");
const regestrationValidator = [
	body("firstName")
		.isString()
		.isLength({ min: 3, max: 20 })
		.trim()
		.isLowercase()
		.withMessage("in-valid firstName"),
	body("lastName")
		.isString()
		.isLength({ min: 3, max: 20 })
		.trim()
		.isLowercase()
		.withMessage("in-valid lastName"),
	body("email").trim().isEmail().withMessage("in-valid email"),
	body("password")
		.isStrongPassword({
			minlength: 8,
			minUppercase: 1,
			minLowercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage("in-valid password"),
	body("idNumber")
		.notEmpty()
		.withMessage("ID Number is required")
		.isLength({ min: 5, max: 15 })
		.withMessage("ID Number must be between 5 and 15 characters"),
];
// 'must password have minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 '),
const fileValidation = {
	image: ["image/jpg", "image/jpeg", "image/png", "image/jfif", "image/webp"],
	file: ["application/pdf", "application/wsword"],
	sdk: ["video/mp4", "audio/mp3"],
};
module.exports = {
	regestrationValidator,
	fileValidation,
};
