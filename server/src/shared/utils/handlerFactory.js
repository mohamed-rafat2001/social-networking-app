import errorHandler from "../middlewares/errorHandler.js";
import appError from "./appError.js";
import APIFeatures from "./apiFeatures.js";

export const deleteOne = (Model) =>
	errorHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(
				appError.Error("No document found with that ID", "fail", 404)
			);
		}

		res.status(200).json({
			status: "success",
			data: null,
		});
	});

export const deleteOneByOwner = (Model, ownerField = "userId") =>
	errorHandler(async (req, res, next) => {
		const doc = await Model.findOneAndDelete({
			_id: req.params.id,
			[ownerField]: req.user._id,
		});

		if (!doc) {
			return next(
				appError.Error(
					"No document found with that ID or you don't have permission",
					"fail",
					404
				)
			);
		}

		res.status(200).json({
			status: "success",
			data: null,
		});
	});

export const updateOne = (Model) =>
	errorHandler(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(
				appError.Error("No document found with that ID", "fail", 404)
			);
		}

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});

export const updateOneByOwner = (Model, ownerField = "userId") =>
	errorHandler(async (req, res, next) => {
		const doc = await Model.findOneAndUpdate(
			{ _id: req.params.id, [ownerField]: req.user._id },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!doc) {
			return next(
				appError.Error(
					"No document found with that ID or you don't have permission",
					"fail",
					404
				)
			);
		}

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});

export const createOne = (Model) =>
	errorHandler(async (req, res, next) => {
		if (req.user && !req.body.userId) req.body.userId = req.user._id;
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: "success",
			data: doc,
		});
	});

export const getOne = (Model, popOptions) =>
	errorHandler(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(
				appError.Error("No document found with that ID", "fail", 404)
			);
		}

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});

export const getAll = (Model, filterOptions = {}, paramMapping = {}) =>
	errorHandler(async (req, res, next) => {
		// To allow for nested GET reviews on post (hack)
		let filter = { ...filterOptions };

		// Map params to filter keys
		Object.keys(paramMapping).forEach((param) => {
			if (req.params[param]) {
				filter[paramMapping[param]] = req.params[param];
			}
		});

		if (req.params.postId) filter.post = req.params.postId;
		if (req.params.userId) filter.userId = req.params.userId;

		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const doc = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: doc.length,
			data: doc,
		});
	});
