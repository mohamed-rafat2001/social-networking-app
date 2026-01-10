import React from "react";
import { cn } from "./utils";

/**
 * Textarea Component
 */
export const Textarea = React.forwardRef(
	({ label, error, className, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					className={cn(
						"flex min-h-[120px] w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-white ring-offset-white dark:ring-offset-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-none",
						error &&
							"border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
						className
					)}
					{...props}
				/>
				{error && (
					<p className="text-xs font-medium text-red-500 ml-1">{error}</p>
				)}
			</div>
		);
	}
);
Textarea.displayName = "Textarea";
