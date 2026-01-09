const errorHandler = (asyncFn) => {
	return (req, res, next) => {
		asyncFn(req, res, next).catch((err) => {
			return next(err);
		});
	};
};

export default errorHandler;
