import React, {
	useState,
	createContext,
	useContext,
	useRef,
	useEffect,
	useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
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
	const triggerRef = useRef(null);
	const [coords, setCoords] = useState({
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	});

	const close = () => setIsOpen(false);

	const updateCoords = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top,
				bottom: rect.bottom,
				left: rect.left,
				right: window.innerWidth - rect.right,
			});
		}
	};

	const toggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		updateCoords();
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			window.addEventListener("scroll", updateCoords, true);
			window.addEventListener("resize", updateCoords);
			return () => {
				window.removeEventListener("scroll", updateCoords, true);
				window.removeEventListener("resize", updateCoords);
			};
		}
	}, [isOpen]);

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
			"text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-primary",
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
