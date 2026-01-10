import React from "react";

const SignUpProgressBar = ({ step }) => {
	return (
		<div className="flex gap-2 mb-8 px-1">
			<div
				className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
					step >= 1 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
				}`}
			/>
			<div
				className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
					step >= 2 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
				}`}
			/>
		</div>
	);
};

export default SignUpProgressBar;
