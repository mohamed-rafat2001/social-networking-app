import React from "react";
import { motion } from "framer-motion";

const WelcomeLoading = ({ firstName }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500"
		>
			{/* Subtle background glow */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px]"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
					className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[100px]"
				/>
			</div>

			<motion.div
				initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
				animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
				transition={{
					type: "spring",
					stiffness: 80,
					damping: 15,
					duration: 1,
				}}
				className="relative text-center px-6"
			>
				<motion.div
					initial={{ y: 30, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						<span className="bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
							Welcome, {firstName}
						</span>
					</h1>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				>
					<p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium">
						in EngiConnect
					</p>
				</motion.div>

				{/* iPhone style loader bar */}
				<div className="mt-16 w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mx-auto">
					<motion.div
						initial={{ x: "-100%" }}
						animate={{ x: "0%" }}
						transition={{
							delay: 0.8,
							duration: 2.5,
							ease: [0.65, 0, 0.35, 1],
						}}
						className="h-full bg-primary rounded-full"
					/>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 2.5, duration: 0.5 }}
				className="absolute bottom-12 text-gray-400 dark:text-gray-500 text-sm font-medium"
			>
				Setting up your workspace...
			</motion.div>
		</motion.div>
	);
};

export default WelcomeLoading;
