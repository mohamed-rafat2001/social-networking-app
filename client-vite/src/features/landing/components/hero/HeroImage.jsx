import React from "react";
import { motion } from "framer-motion";

const HeroImage = () => {
	return (
		<div className="md:w-1/2 relative">
			<motion.div
				initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
				animate={{ opacity: 1, scale: 1, rotate: 0 }}
				transition={{ duration: 1, delay: 0.3 }}
				className="relative z-10"
			>
				<div className="relative group">
					<div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
					<img
						src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
						alt="Engineering Students Collaboration"
						className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl"
					/>
				</div>

				{/* Floating badges */}
				<motion.div
					animate={{ y: [0, -15, 0] }}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute top-10 -left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-3"
				>
					<div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
							Verified
						</p>
						<p className="text-sm font-black text-slate-900 dark:text-white">
							Student ID
						</p>
					</div>
				</motion.div>

				<motion.div
					animate={{ y: [0, 15, 0] }}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 0.5,
					}}
					className="absolute bottom-10 -right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-700 flex items-center gap-3"
				>
					<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-primary rounded-xl flex items-center justify-center">
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<div>
						<p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
							Community
						</p>
						<p className="text-sm font-black text-slate-900 dark:text-white">
							10+ Majors
						</p>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default HeroImage;
