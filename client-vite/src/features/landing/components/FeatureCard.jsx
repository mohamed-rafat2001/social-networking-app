import React from "react";
import { motion } from "framer-motion";

export const FeatureCard = ({ feature, variants }) => {
	return (
		<motion.div
			variants={variants}
			whileHover={{ y: -10 }}
			className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 dark:hover:bg-gray-800/80"
		>
			<div
				className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg ${feature.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
			>
				<feature.icon size={32} />
			</div>
			<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
				{feature.name}
			</h3>
			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
				{feature.description}
			</p>
			<div className="w-10 h-1 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:w-20 group-hover:bg-primary transition-all duration-300"></div>
		</motion.div>
	);
};
