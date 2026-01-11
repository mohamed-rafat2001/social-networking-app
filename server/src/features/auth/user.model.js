import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

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
			required: true,
		},
		country: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		major: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		phoneNumber: {
			type: String,
			trim: true,
			required: true,
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
			default: true,
		},
		followId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Follow",
		},
		blockListId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Block",
		},
		userType: {
			type: String,
			enum: ["engineering student", "engineering teacher", "engineer"],
			required: true,
		},
		acountType: {
			type: String,
			enum: ["private", "public"],
			default: "public",
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		passwordResetCode: Number,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtuals for followers and following count
userSchema.virtual("followersCount", {
	ref: "Follow",
	localField: "_id",
	foreignField: "following",
	count: true,
});

userSchema.virtual("followingCount", {
	ref: "Follow",
	localField: "_id",
	foreignField: "follower",
	count: true,
});

userSchema.methods.createToken = function () {
	const token = jwt.sign(
		{ id: this._id.toString() },
		process.env.USER_KEY_TOKEN
	);
	return token;
};
// create passwordResetToken
userSchema.methods.createPasswordResetCode = function () {
	const buffer = crypto.randomBytes(6);
	let code = "";

	for (let i = 0; i < 6; i++) {
		code += (buffer[i] % 10).toString();
	}
	this.passwordResetCode = code;
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return code;
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
		let attempts = 0;

		while (!isUnique && attempts < 10) {
			const existingUser = await mongoose.model("User").findOne({
				username: uniqueUsername,
			});
			if (!existingUser) {
				isUnique = true;
			} else {
				// Append random digits if collision occurs
				const randomSuffix = Math.floor(1000 + Math.random() * 9000);
				uniqueUsername = `${baseUsername}${randomSuffix}`;
				attempts++;
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
