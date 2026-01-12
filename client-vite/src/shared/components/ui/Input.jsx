import React from "react";
import { cn } from "./utils";

/**
 * Input Component
 */
export const Input = React.forwardRef(
	({ label, icon: Icon, error, className, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
						{label}
					</label>
				)}
				<div className="relative group">
					{Icon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
							<Icon size={20} />
						</div>
					)}
					<input
						ref={ref}
						className={cn(
							"flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white ring-offset-white dark:ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
							Icon && "pl-10",
							error &&
								"border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
							className
						)}
						{...props}
					/>
				</div>
				{error && (
					<p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
						{error}
					</p>
				)}
			</div>
		);
	}
);
Input.displayName = "Input";
