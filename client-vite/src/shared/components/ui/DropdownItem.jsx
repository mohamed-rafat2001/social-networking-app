import React, { useContext } from "react";
import { cn } from "./utils";
import { DropdownContext } from "./DropdownContext";

export const DropdownItem = ({
	children,
	onClick,
	variant = "default",
	icon: Icon,
	className,
}) => {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error("DropdownItem must be used within a Dropdown");
	}
	const { close } = context;

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
