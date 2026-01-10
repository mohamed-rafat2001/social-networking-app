import React from "react";
import { cn } from "./utils";

/**
 * Avatar Component
 */
export const Avatar = ({ src, alt, className, size = "md", isActive }) => {
	const sizes = {
		xs: "w-6 h-6",
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
		xl: "w-20 h-20",
		"2xl": "w-32 h-32",
	};

	const statusSizes = {
		xs: "w-2 h-2",
		sm: "w-2.5 h-2.5",
		md: "w-3 h-3",
		lg: "w-3.5 h-3.5",
		xl: "w-5 h-5",
		"2xl": "w-6 h-6",
	};

	const currentSize = sizes[size] || sizes.md;

	return (
		<div className={cn("relative inline-block shrink-0", currentSize)}>
			<div
				className={cn(
					"relative flex h-full w-full shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800",
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
