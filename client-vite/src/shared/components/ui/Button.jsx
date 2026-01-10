import React from "react";
import { cn } from "./utils";

/**
 * Button Component
 */
export const Button = React.forwardRef(
	({ className, variant = "primary", size = "md", ...props }, ref) => {
		const variants = {
			primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
			secondary:
				"bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
			ghost:
				"hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
			danger: "bg-red-500 text-white hover:bg-red-600",
		};

		const sizes = {
			sm: "px-3 py-1.5 text-sm",
			md: "px-4 py-2",
			lg: "px-6 py-3 text-lg",
		};

		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
					variants[variant],
					sizes[size],
					className
				)}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";
