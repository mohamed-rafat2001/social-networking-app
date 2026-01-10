import nodemailer from "nodemailer";
const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	const mailOptions = {
		from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
		to: options.email,
		subject: options.subject,
		html: options.html,
	};
	await transporter.sendMail(mailOptions);
};
export default sendEmail;
