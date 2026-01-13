import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUp } from "react-icons/hi";
import { cn } from "../../../shared/components/ui";

const ScrollToTopButton = ({ show, hasNewContent, onClick }) => {
	return (
		<AnimatePresence>
			{show && (
				<motion.button
					initial={{ opacity: 0, y: 20, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.8 }}
					onClick={onClick}
					className={cn(
						"fixed bottom-20 right-6 z-50 flex items-center gap-2 p-3 rounded-full shadow-2xl transition-all duration-300 group",
						hasNewContent
							? "bg-primary text-white px-5"
							: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
					)}
				>
					{hasNewContent && (
						<span className="text-sm font-bold whitespace-nowrap">
							New Posts
						</span>
					)}
					<HiArrowUp
						className={cn(
							"w-5 h-5 transition-transform group-hover:-translate-y-0.5",
							hasNewContent ? "animate-bounce" : ""
						)}
					/>
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTopButton;
