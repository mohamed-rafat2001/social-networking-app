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
					<label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					className={cn(
						"flex min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white ring-offset-white dark:ring-offset-slate-950 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-none",
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
