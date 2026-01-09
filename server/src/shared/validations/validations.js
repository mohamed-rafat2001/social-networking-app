import { body } from "express-validator";

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
];

const fileValidation = {
	image: ["image/jpg", "image/jpeg", "image/png", "image/jfif", "image/webp"],
	file: ["application/pdf", "application/wsword"],
	sdk: ["video/mp4", "audio/mp3"],
};

export { regestrationValidator, fileValidation };
