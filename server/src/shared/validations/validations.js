import { body } from "express-validator";

const regestrationValidator = [
	body("firstName")
		.isString()
		.isLength({ min: 3, max: 20 })
		.trim()
		.withMessage("First name must be between 3 and 20 characters"),
	body("lastName")
		.isString()
		.isLength({ min: 3, max: 20 })
		.trim()
		.withMessage("Last name must be between 3 and 20 characters"),
	body("email").trim().isEmail().withMessage("Please enter a valid email"),
	body("password")
		.isStrongPassword({
			minlength: 8,
			minUppercase: 1,
			minLowercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			"Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
		),
	body("gender")
		.isIn(["male", "female"])
		.withMessage("Gender must be male or female"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Phone number is required")
		.isMobilePhone()
		.withMessage("Please enter a valid phone number"),
	body("city").notEmpty().trim().withMessage("City is required"),
	body("country").notEmpty().trim().withMessage("Country is required"),
	body("major").notEmpty().trim().withMessage("Major is required"),
	body("userType")
		.isIn(["engineering student", "engineering teacher", "engineer"])
		.withMessage("Please select a valid profession"),
];

const fileValidation = {
	image: ["image/jpg", "image/jpeg", "image/png", "image/jfif", "image/webp"],
	file: ["application/pdf", "application/wsword"],
	sdk: ["video/mp4", "audio/mp3"],
};

export { regestrationValidator, fileValidation };
