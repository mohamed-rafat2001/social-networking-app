import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineSearch } from "react-icons/hi";

export const NotFound = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-center space-y-8">
				{/* 404 Number Animation */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					<h1 className="text-9xl font-black text-primary/10 dark:text-primary/5 select-none">
						404
					</h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 260,
								damping: 20,
								delay: 0.2,
							}}
							className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
						>
							<HiOutlineSearch className="w-16 h-16 text-primary" />
						</motion.div>
					</div>
				</motion.div>

				{/* Text Content */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="space-y-4"
				>
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
						Page not found
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						Sorry, we couldn't find the page you're looking for. It might have
						been moved or deleted.
					</p>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
				>
					<Link
						to="/feed"
						className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20"
					>
						Back to Feed
					</Link>
					<Link
						to="/"
						className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
					>
						<HiOutlineArrowLeft className="mr-2 -ml-1 w-5 h-5" />
						Landing Page
					</Link>
				</motion.div>

				{/* Floating Elements Decoration */}
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
							animate={{
								y: [0, -20, 0],
								scale: [1, 1.1, 1],
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 3 + i,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 0.5,
							}}
							style={{
								width: Math.random() * 100 + 50,
								height: Math.random() * 100 + 50,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default NotFound;
