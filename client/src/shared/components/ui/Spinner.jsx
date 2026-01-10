import React from "react";
import { cn } from "./utils";

/**
 * Spinner Component
 */
export const Spinner = ({ className, size = "md", variant = "primary" }) => {
	const sizes = {
		sm: "h-4 w-4 border-2",
		md: "h-8 w-8 border-2",
		lg: "h-12 w-12 border-3",
		xl: "h-16 w-16 border-4",
	};

	const variants = {
		primary: "border-primary/20 border-t-primary",
		white: "border-white/20 border-t-white",
		gray: "border-gray-200 dark:border-gray-700 border-t-gray-500",
	};

	return (
		<div
			className={cn(
				"animate-spin rounded-full",
				sizes[size],
				variants[variant],
				className
			)}
		/>
	);
};
