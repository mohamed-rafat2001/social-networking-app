import User from "../auth/user.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";

const Admins = errorHandler(async (req, res, next) => {
	// Fetch admins since middleware might not attach them anymore in the new ESM logic if not updated
	const admins = await User.find({ role: "admin" });
	if (!admins || admins.length === 0) {
		return next(appError.Error("not admin founded", "fail", 404));
	}
	res.status(200).json({ status: "success", data: admins });
});

const Users = errorHandler(async (req, res, next) => {
	const users = await User.find({ role: "user" });
	if (!users) {
		return next(appError.Error("not users founded", "fail", 404));
	}
	res.status(200).json({ status: "success", data: users });
});

const singleUser = errorHandler(async (req, res, next) => {
	const query = req.query;
	const user = await User.findOne(query);
	if (!user) {
		return next(appError.Error("not user founded", "fail", 404));
	}
	res.status(200).json({ status: "success", data: user });
});

const deleteUser = errorHandler(async (req, res, next) => {
	const _id = req.params.id;
	const user = await User.findByIdAndDelete(_id);
	if (!user) {
		return next(appError.Error("not user founded", "fail", 404));
	}
	res.status(200).json({ status: "success", data: "user deleted" });
});

const blockAndUnblock = errorHandler(async (req, res, next) => {
	const _id = req.params.id;
	const findUser = await User.findById(_id);
	if (!findUser) {
		return next(appError.Error("user not found", "fail", 404));
	}

	if (findUser.block === false) {
		const user = await User.findByIdAndUpdate(
			_id,
			{ block: true },
			{ runValidators: true, new: true }
		);
		if (user)
			return res
				.status(200)
				.json({ status: "success", data: user, message: "user blocked" });
	} else {
		const user = await User.findByIdAndUpdate(
			_id,
			{ block: false },
			{ runValidators: true, new: true }
		);
		if (user)
			return res
				.status(200)
				.json({ status: "success", data: user, message: "user unblocked" });
	}
});

export { Admins, Users, singleUser, deleteUser, blockAndUnblock };
