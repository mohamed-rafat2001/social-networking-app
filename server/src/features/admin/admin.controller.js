import User from "../auth/user.model.js";
import errorHandler from "../../shared/middlewares/errorHandler.js";
import appError from "../../shared/utils/appError.js";
import * as factory from "../../shared/utils/handlerFactory.js";

const Admins = factory.getAll(User, { role: "admin" });
const Users = factory.getAll(User, { role: "user" });
const singleUser = factory.getOne(User);
const deleteUser = factory.deleteOne(User);

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
