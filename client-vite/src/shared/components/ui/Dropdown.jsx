import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./utils";
import { useDropdown } from "./useDropdown";
import { DropdownContext } from "./DropdownContext";

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
	const { isOpen, triggerRef, coords, close, toggle } = useDropdown();

	return (
		<DropdownContext.Provider value={{ close }}>
			<div className="relative inline-block" ref={triggerRef} onClick={toggle}>
				<div className="cursor-pointer pointer-events-none">{trigger}</div>

				<AnimatePresence>
					{isOpen && (
						<DropdownPortal>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 z-[99999] bg-black/5 backdrop-blur-[1px]"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									close();
								}}
							>
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
									style={{
										position: "fixed",
										top: position === "bottom" ? coords.bottom + 8 : "auto",
										bottom:
											position === "top"
												? window.innerHeight - coords.top + 8
												: "auto",
										left: align === "left" ? coords.left : "auto",
										right: align === "right" ? coords.right : "auto",
										zIndex: 100000,
									}}
									onClick={(e) => e.stopPropagation()}
									className={cn(
										"w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden py-1.5",
										className
									)}
								>
									{children}
								</motion.div>
							</motion.div>
						</DropdownPortal>
					)}
				</AnimatePresence>
			</div>
		</DropdownContext.Provider>
	);
};

const DropdownPortal = ({ children }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	return mounted ? createPortal(children, document.body) : null;
};

export { DropdownItem } from "./DropdownItem";

