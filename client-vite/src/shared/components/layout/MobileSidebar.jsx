import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import Sidebar from "./Sidebar";

const MobileSidebar = ({ isOpen, onClose }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] lg:hidden"
					/>
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-[210] lg:hidden shadow-2xl p-4 flex flex-col"
					>
						<div className="flex items-center justify-between mb-6 px-2">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
									<svg
										className="w-5 h-5 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2.5"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path>
									</svg>
								</div>
								<span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
									Engi<span className="text-primary">Connect</span>
								</span>
							</div>
							<button
								onClick={onClose}
								className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
							>
								<HiX size={24} />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto">
							<Sidebar onMobileItemClick={onClose} />
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default MobileSidebar;
