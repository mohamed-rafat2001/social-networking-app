import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";
import { cn } from "./utils";

/**
 * Reusable Modal Component
 * Built with Tailwind CSS and Framer Motion
 */
export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	size = "md",
	showCloseButton = true,
}) => {
	const sizes = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
		full: "max-w-[95vw]",
	};

	// Animation variants
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const modalVariants = {
		hidden: { opacity: 0, scale: 0.95, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: { type: "spring", damping: 25, stiffness: 300 },
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			y: 20,
			transition: { duration: 0.2 },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
					{/* Backdrop */}
					<motion.div
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
						onClick={onClose}
					/>

					{/* Modal Content */}
					<motion.div
						variants={modalVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className={cn(
							"relative w-full rounded-[2rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]",
							sizes[size],
							className
						)}
					>
						{/* Header */}
						{(title || showCloseButton) && (
							<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
								<h3 className="text-xl font-black text-gray-900 dark:text-white">
									{title}
								</h3>
								{showCloseButton && (
									<button
										onClick={onClose}
										className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
									>
										<HiOutlineX size={22} />
									</button>
								)}
							</div>
						)}

						{/* Body */}
						<div className="p-6 overflow-y-auto custom-scrollbar flex-1">
							{children}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
