import nodemailer from "nodemailer";
import uniqid from "uniqid";

const email = async (user) => {
	const token = uniqid();
	user.passwordResetToken = token;
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: '"EngiConnect 👻" <college@gmail.com>',
		to: user.email,
		subject: "forgot password",
		text: `hey ${user.firstName} ${user.lastName} \n this your verify code to reset password =>>  ${token}`,
		html: "",
	});
	return 0;
};

export default email;
