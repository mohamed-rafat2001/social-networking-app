import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./utils";

const DropdownContext = createContext(null);

/**
 * Dropdown Component
 */
export const Dropdown = ({
	trigger,
	children,
	align = "right",
	position = "bottom",
	className,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const close = () => setIsOpen(false);

	const positions = {
		bottom: "mt-2",
		top: "bottom-full mb-2",
	};

	return (
		<DropdownContext.Provider value={{ close }}>
			<div className="relative inline-block text-left">
				<div
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(!isOpen);
					}}
					className="cursor-pointer"
				>
					{trigger}
				</div>
				<AnimatePresence>
					{isOpen && (
						<>
							<div
								className="fixed inset-0 z-40"
								onClick={(e) => {
									e.stopPropagation();
									close();
								}}
							/>
							<motion.div
								initial={{
									opacity: 0,
									scale: 0.95,
									y: position === "bottom" ? -10 : 10,
								}}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{
									opacity: 0,
									scale: 0.95,
									y: position === "bottom" ? -10 : 10,
								}}
								transition={{ duration: 0.1 }}
								className={cn(
									"absolute z-50 w-56 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden py-1.5",
									align === "right" ? "right-0" : "left-0",
									positions[position],
									className
								)}
							>
								<div>{children}</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</DropdownContext.Provider>
	);
};

export const DropdownItem = ({
	children,
	onClick,
	variant = "default",
	icon: Icon,
	className,
}) => {
	const { close } = useContext(DropdownContext);
	const variants = {
		default:
			"text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-primary dark:hover:text-primary",
		danger: "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
	};

	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				if (onClick) onClick(e);
				close();
			}}
			className={cn(
				"flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-semibold transition-all duration-200",
				variants[variant],
				className
			)}
		>
			{Icon && <Icon size={20} className="shrink-0 opacity-80" />}
			{children}
		</button>
	);
};
