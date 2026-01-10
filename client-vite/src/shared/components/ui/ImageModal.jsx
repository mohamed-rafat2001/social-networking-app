import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiOutlineX,
	HiOutlineDownload,
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
} from "react-icons/hi";

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
