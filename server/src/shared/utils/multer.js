import multer from "multer";

export const fileUpload = (validation) => {
	const storage = multer.diskStorage({});
	function fileFilter(req, file, cb) {
		if (!validation.includes(file.mimetype)) {
			console.log(`Multer validation failed for mimetype: ${file.mimetype}`);
			return cb(
				new Error(
					`Invalid file type: ${file.mimetype}. Expected: ${validation.join(
						", "
					)}`
				),
				false
			);
		}
		cb(null, true);
	}
	const upload = multer({
		dest: "uploads",
		fileFilter,
		storage,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB per file
			files: 10, // Max 10 files
		},
	});
	return upload;
};
