import React from "react";
import { cn } from "./utils";

/**
 * Select Component
 */
export const Select = React.forwardRef(
	({ label, icon: Icon, error, children, className, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
						{label}
					</label>
				)}
				<div className="relative group">
					{Icon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
							<Icon size={20} />
						</div>
					)}
					<select
						ref={ref}
						className={cn(
							"flex h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-white ring-offset-white dark:ring-offset-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
							Icon && "pl-10",
							error &&
								"border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
							className
						)}
						{...props}
					>
						{children}
					</select>
					<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
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
Select.displayName = "Select";
