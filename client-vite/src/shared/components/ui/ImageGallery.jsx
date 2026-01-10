import React, { useState } from "react";
import { cn } from "./utils";
import { ImageModal } from "./ImageModal";

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
