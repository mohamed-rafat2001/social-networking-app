import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { cn } from "../../../../shared/components/ui";

export const PostImagePreviews = ({
	previewUrls,
	removeFile,
	setSelectedPreviewIndex,
	setIsPreviewModalOpen,
}) => {
	return (
		<AnimatePresence>
			{previewUrls.length > 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className={cn(
						"grid gap-2 mt-4 rounded-2xl overflow-hidden relative z-30",
						previewUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
					)}
				>
					{previewUrls.map((url, index) => (
						<div key={url} className="relative group aspect-video">
							<img
								src={url}
								alt=""
								className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
								onClick={() => {
									setSelectedPreviewIndex(index);
									setIsPreviewModalOpen(true);
								}}
							/>
							<button
								type="button"
								onClick={() => removeFile(index)}
								className="absolute top-2 right-2 z-40 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
							>
								<HiX size={18} />
							</button>
						</div>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
