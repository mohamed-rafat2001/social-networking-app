import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import UserSearch from "./UserSearch";

const NewChatModal = ({ isOpen, onClose }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0"
						onClick={onClose}
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative w-full max-w-md shadow-2xl"
					>
						<UserSearch onClose={onClose} />
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default NewChatModal;
