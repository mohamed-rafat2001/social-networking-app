import React from "react";
import { motion } from "framer-motion";
import { Spinner } from "../../../../shared/components/ui";

const LandingLoading = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
			<div className="relative flex items-center justify-center">
				<div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping"></div>
				<Spinner size="xl" />
			</div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-8 text-center"
			>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					Social App
				</h2>
				<p className="text-gray-500 dark:text-gray-400 font-medium">
					Connecting students together...
				</p>
			</motion.div>
		</div>
	);
};

export default LandingLoading;
