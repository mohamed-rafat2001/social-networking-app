import React from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

/**
 * ProgressBar Component
 */
export const ProgressBar = ({ progress, className }) => {
	const safeProgress = Math.min(Math.max(0, progress), 100);

	return (
		<div
			className={cn(
				"w-full bg-gray-200/20 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden backdrop-blur-sm",
				className
			)}
		>
			<motion.div
				initial={{ width: 0 }}
				animate={{ width: `${safeProgress}%` }}
				transition={{ type: "spring", bounce: 0, duration: 0.5 }}
				className={cn(
					"bg-primary h-full transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]",
					safeProgress === 100 && "bg-green-500"
				)}
			/>
		</div>
	);
};
