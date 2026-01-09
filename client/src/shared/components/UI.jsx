import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiOutlineX,
	HiOutlineDownload,
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
} from "react-icons/hi";

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
		xs: "w-6 h-6",
		sm: "w-8 h-8",
		md: "w-10 h-10",
		lg: "w-12 h-12",
		xl: "w-20 h-20",
	};

	const statusSizes = {
		xs: "w-2 h-2",
		sm: "w-2.5 h-2.5",
		md: "w-3 h-3",
		lg: "w-3.5 h-3.5",
		xl: "w-5 h-5",
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
 * ImageModal Component
 * Full-screen modal for viewing images
 */
export const ImageModal = ({
	isOpen,
	onClose,
	images = [],
	initialIndex = 0,
}) => {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	if (!isOpen) return null;

	const handlePrevious = (e) => {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	};

	const handleNext = (e) => {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	};

	const currentImage = images[currentIndex]?.secure_url || images[currentIndex];

	const handleDownload = async (e) => {
		e.stopPropagation();
		try {
			const response = await fetch(currentImage);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;

			// Extract filename from URL or use a default
			const filename = currentImage.split("/").pop() || "download";
			link.setAttribute("download", filename);

			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Download failed:", error);
			// Fallback to opening in new tab if blob download fails
			window.open(currentImage, "_blank");
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
				onClick={onClose}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-6 right-6 z-[110] p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
				>
					<HiOutlineX size={28} />
				</button>

				{/* Download Button */}
				<button
					onClick={handleDownload}
					className="absolute top-6 right-20 z-[110] p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
				>
					<HiOutlineDownload size={24} />
				</button>

				{/* Navigation - Prev */}
				{images.length > 1 && (
					<button
						onClick={handlePrevious}
						className="absolute left-6 z-[110] p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
					>
						<HiOutlineChevronLeft size={36} />
					</button>
				)}

				{/* Main Image */}
				<motion.div
					key={currentIndex}
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 20 }}
					transition={{ type: "spring", damping: 25, stiffness: 200 }}
					className="relative max-w-7xl max-h-full flex items-center justify-center"
					onClick={(e) => e.stopPropagation()}
				>
					<img
						src={currentImage}
						alt={`Full view ${currentIndex + 1}`}
						className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
					/>

					{/* Index Indicator */}
					{images.length > 1 && (
						<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
							{currentIndex + 1} / {images.length}
						</div>
					)}
				</motion.div>

				{/* Navigation - Next */}
				{images.length > 1 && (
					<button
						onClick={handleNext}
						className="absolute right-6 z-[110] p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
					>
						<HiOutlineChevronRight size={36} />
					</button>
				)}
			</motion.div>
		</AnimatePresence>
	);
};

/**
 * ImageGallery Component
 * Displays images in a grid similar to Twitter/WhatsApp
 */
export const ImageGallery = ({ images = [], className }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (!images || images.length === 0) return null;

	const count = images.length;

	const handleImageClick = (e, index) => {
		e.stopPropagation();
		setSelectedIndex(index);
		setIsModalOpen(true);
	};

	const getGridClass = () => {
		if (count === 1) return "grid-cols-1";
		if (count === 2) return "grid-cols-2";
		if (count === 3) return "grid-cols-2 grid-rows-2";
		return "grid-cols-2 grid-rows-2";
	};

	const getImageClass = (index) => {
		if (count === 3 && index === 0) return "row-span-2 h-full";
		return "h-full";
	};

	const showMoreCount = count > 4 ? count - 4 : 0;

	return (
		<>
			<div
				className={cn(
					"grid gap-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50",
					getGridClass(),
					count === 1 ? "max-h-[512px]" : "aspect-square md:aspect-[16/9]",
					className
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{images.slice(0, 4).map((image, index) => (
					<div
						key={index}
						className={cn(
							"relative group cursor-pointer",
							getImageClass(index)
						)}
						onClick={(e) => handleImageClick(e, index)}
					>
						<img
							src={image.secure_url || image}
							alt={`Gallery image ${index + 1}`}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
						{showMoreCount > 0 && index === 3 && (
							<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">
								<span className="text-white text-2xl font-bold">
									+{showMoreCount}
								</span>
								<span className="text-white/80 text-xs font-medium uppercase tracking-wider">
									more
								</span>
							</div>
						)}
					</div>
				))}
			</div>

			<ImageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				images={images}
				initialIndex={selectedIndex}
			/>
		</>
	);
};

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
