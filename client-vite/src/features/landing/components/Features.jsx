import React from "react";
import {
	HiUsers,
	HiChatAlt2,
	HiShare,
	HiCloudUpload,
	HiShieldCheck,
	HiLightningBolt,
} from "react-icons/hi";
import { motion } from "framer-motion";

const Features = () => {
	const features = [
		{
			name: "Engineer Networking",
			description:
				"Connect with professional engineers and students from all majors to build lasting professional relationships.",
			icon: HiUsers,
			color: "bg-blue-500",
			shadow: "shadow-blue-500/20",
		},
		{
			name: "Experience Sharing",
			description:
				"Share your engineering experiences, career journey, and technical insights with a global community.",
			icon: HiChatAlt2,
			color: "bg-purple-500",
			shadow: "shadow-purple-500/20",
		},
		{
			name: "Major-Specific Groups",
			description:
				"Join dedicated groups for all engineering majors to discuss specialized topics and share expertise.",
			icon: HiShare,
			color: "bg-indigo-500",
			shadow: "shadow-indigo-500/20",
		},
		{
			name: "Project Collaboration",
			description:
				"Find teammates for your next big engineering project and showcase your work to the world.",
			icon: HiCloudUpload,
			color: "bg-green-500",
			shadow: "shadow-green-500/20",
		},
		{
			name: "Global Community",
			description:
				"A professional environment designed to bridge the gap between all engineering disciplines.",
			icon: HiShieldCheck,
			color: "bg-red-500",
			shadow: "shadow-red-500/20",
		},
		{
			name: "Instant Connectivity",
			description:
				"Connect with any engineer instantly, breaking down barriers between different engineering fields.",
			icon: HiLightningBolt,
			color: "bg-yellow-500",
			shadow: "shadow-yellow-500/20",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	return (
		<section
			id="features"
			className="py-24 relative overflow-hidden transition-colors duration-500"
		>
			<div className="container mx-auto px-4">
				<div className="text-center max-w-3xl mx-auto mb-20">
					<motion.span
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
					>
						Powerful Features
					</motion.span>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6"
					>
						Everything you need to <span className="text-primary">excel</span>{" "}
						in engineering
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-xl text-gray-600 dark:text-gray-400"
					>
						Tailored tools and features designed specifically for the unique
						challenges of engineering students.
					</motion.p>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{features.map((feature, idx) => (
						<motion.div
							key={idx}
							variants={itemVariants}
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
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default Features;
