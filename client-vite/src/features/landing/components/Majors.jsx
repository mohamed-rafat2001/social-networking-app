import React from "react";
import { motion } from "framer-motion";

const Majors = () => {
	const majors = [
		{ name: "Computer Science", students: "1.2k+", color: "bg-blue-500" },
		{ name: "Mechanical Engineering", students: "800+", color: "bg-red-500" },
		{
			name: "Electrical Engineering",
			students: "750+",
			color: "bg-yellow-500",
		},
		{ name: "Civil Engineering", students: "600+", color: "bg-green-500" },
		{ name: "Chemical Engineering", students: "450+", color: "bg-purple-500" },
		{ name: "Aerospace Engineering", students: "300+", color: "bg-indigo-500" },
		{ name: "Biomedical Engineering", students: "250+", color: "bg-pink-500" },
		{
			name: "Industrial Engineering",
			students: "400+",
			color: "bg-orange-500",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, scale: 0.9 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 15,
			},
		},
	};

	return (
		<section
			id="majors"
			className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
		>
			<div className="container mx-auto px-4">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-base font-bold text-primary tracking-widest uppercase mb-4"
					>
						Our Community
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6"
					>
						Connect with peers in your major
					</motion.p>
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-lg text-gray-600 dark:text-gray-400"
					>
						Join thousands of students across all engineering departments
						already sharing insights and collaborating in groups.
					</motion.p>
				</div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
				>
					{majors.map((major) => (
						<motion.div
							key={major.name}
							variants={itemVariants}
							whileHover={{ y: -5, scale: 1.02 }}
							className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer group"
						>
							<div
								className={`w-12 h-12 ${major.color} rounded-2xl mb-6 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform`}
							>
								{major.name.charAt(0)}
							</div>
							<h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
								{major.name}
							</h4>
							<p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
								{major.students} Members
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default Majors;
