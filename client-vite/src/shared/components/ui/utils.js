import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

/**
 * Utility for tailwind class merging
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
