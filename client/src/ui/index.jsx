import React from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

/**
 * Utility for tailwind class merging
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

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

/**
 * Avatar Component
 */
export const Avatar = ({ src, alt, className, size = "md", isActive }) => {
	const sizes = {
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
		xl: "w-20 h-20",
	};

	const statusSizes = {
		sm: "w-2.5 h-2.5",
		md: "w-3 h-3",
		lg: "w-3.5 h-3.5",
		xl: "w-5 h-5",
	};

	return (
		<div className="relative inline-block">
			<div
				className={cn(
					"relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800",
					sizes[size],
					className
				)}
			>
				{src ? (
					<img
						src={src}
						alt={alt || "Avatar"}
						className="aspect-square h-full w-full object-cover"
						crossOrigin="anonymous"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-2/3 w-2/3"
						>
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</div>
				)}
			</div>
			{isActive && (
				<span
					className={cn(
						"absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900 bg-green-500",
						statusSizes[size]
					)}
				/>
			)}
		</div>
	);
};

/**
 * Input Component
 */
export const Input = React.forwardRef(
	({ label, icon: Icon, error, className, ...props }, ref) => {
		return (
			<div className="w-full space-y-1.5">
				{label && (
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
						{label}
					</label>
				)}
				<div className="relative group">
					{Icon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
							<Icon size={20} />
						</div>
					)}
					<input
						ref={ref}
						className={cn(
							"flex h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-white ring-offset-white dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50",
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
