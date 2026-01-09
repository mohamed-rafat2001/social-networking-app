import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
		},
		city: {
			type: String,
			trim: true,
			lowercase: true,
		},
		bio: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("please enter valid email");
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			validate(value) {
				if (
					!validator.isStrongPassword(value, {
						minlength: 8,
						minUppercase: 1,
						minLowercase: 1,
						minNumbers: 1,
						minSymbols: 1,
					})
				) {
					throw new Error("please enter strong password");
				}
			},
		},
		image: {
			public_id: String,
			secure_url: String,
		},
		role: {
			type: String,
			default: "user",
			enum: ["admin", "user"],
		},
		block: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		passwordResetToken: {
			type: String,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

userSchema.methods.creatToken = function () {
	const token = jwt.sign(
		{ id: this._id.toString() },
		process.env.USER_KEY_TOKEN
	);
	return token;
};

// Auto-generate unique username
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcryptjs.hash(this.password, 8);
	}

	if (this.isNew && !this.username) {
		const baseUsername = `${this.firstName}${this.lastName}`
			.toLowerCase()
			.replace(/\s+/g, "");

		let uniqueUsername = baseUsername;
		let isUnique = false;

		while (!isUnique) {
			const existingUser = await mongoose.models.User.findOne({
				username: uniqueUsername,
			});
			if (!existingUser) {
				isUnique = true;
			} else {
				// Append 3-4 random digits if collision occurs
				const randomSuffix = Math.floor(1000 + Math.random() * 9000);
				uniqueUsername = `${baseUsername}${randomSuffix}`;
			}
		}
		this.username = uniqueUsername;
	}
	next();
});

userSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	delete user.__v;
	return user;
};

const User = mongoose.model("User", userSchema);
export default User;
