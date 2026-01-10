import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";
import { ImageModal } from "../../../../shared/components/ui";

const ChatFilePreview = ({
	previewUrls,
	setPreviewUrls,
	setSelectedFiles,
	setSelectedPreviewIndex,
	setIsPreviewModalOpen,
	removeFile,
	previewScrollRef,
	isPreviewModalOpen,
	selectedPreviewIndex,
}) => {
	if (previewUrls.length === 0) return null;

	return (
		<div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs font-medium text-gray-500 dark:text-gray-400">
					{previewUrls.length} image{previewUrls.length > 1 ? "s" : ""} selected
				</span>
				<button
					onClick={() => {
						previewUrls.forEach((url) => URL.revokeObjectURL(url));
						setPreviewUrls([]);
						setSelectedFiles([]);
					}}
					className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
				>
					Clear all
				</button>
			</div>
			<div
				ref={previewScrollRef}
				className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
			>
				<AnimatePresence>
					{previewUrls.map((url, index) => (
						<motion.div
							key={url}
							initial={{ opacity: 0, scale: 0.8, x: -20 }}
							animate={{ opacity: 1, scale: 1, x: 0 }}
							exit={{ opacity: 0, scale: 0.8, x: -20 }}
							className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer group shadow-sm"
							onClick={() => {
								setSelectedPreviewIndex(index);
								setIsPreviewModalOpen(true);
							}}
						>
							<img
								src={url}
								alt="preview"
								className="w-full h-full object-cover transition-transform group-hover:scale-110"
							/>
							<button
								onClick={(e) => {
									e.stopPropagation();
									removeFile(index);
								}}
								className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
							>
								<HiOutlineX size={12} />
							</button>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<ImageModal
				isOpen={isPreviewModalOpen}
				onClose={() => setIsPreviewModalOpen(false)}
				images={previewUrls}
				initialIndex={selectedPreviewIndex}
			/>
		</div>
	);
};

export default ChatFilePreview;
