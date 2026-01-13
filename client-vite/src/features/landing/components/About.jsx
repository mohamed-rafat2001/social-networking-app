import React from "react";
import { motion } from "framer-motion";
import {
	HiOutlineLightBulb,
	HiOutlineGlobeAlt,
	HiOutlineAcademicCap,
} from "react-icons/hi";

const About = () => {
	return (
		<section id="about" className="py-24 overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="flex flex-col lg:flex-row items-center gap-16">
					<div className="lg:w-1/2 relative">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
						>
							<img
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
								alt="Students working together"
								className="w-full object-cover aspect-[4/3]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
						</motion.div>
						<div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -z-10 transition-colors duration-300"></div>
						<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-full -z-10 transition-colors duration-300"></div>
					</div>

					<div className="lg:w-1/2">
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-base font-bold text-primary tracking-widest uppercase mb-4">
								About Us
							</h2>
							<h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
								Empowering Every Engineer to Succeed
							</h3>
							<p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
								EngiConnect was founded with a simple mission: to make all engineers connected with together. 
								We bridge the gap between students and professionals, creating a unified space 
								for sharing experiences and expertise across all engineering disciplines.
							</p>

							<div className="space-y-8">
								<div className="flex gap-5">
									<div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-xl flex items-center justify-center">
										<HiOutlineLightBulb size={24} />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
											Experience Sharing
										</h4>
										<p className="text-gray-600 dark:text-gray-400">
											Learn from the journeys of senior engineers and share your own technical milestones.
										</p>
									</div>
								</div>

								<div className="flex gap-5">
									<div className="w-12 h-12 shrink-0 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
										<HiOutlineGlobeAlt size={24} />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
											Global Network
										</h4>
										<p className="text-gray-600 dark:text-gray-400">
											Connect with engineers worldwide, fostering cross-border collaboration and innovation.
										</p>
									</div>
								</div>

								<div className="flex gap-5">
									<div className="w-12 h-12 shrink-0 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
										<HiOutlineAcademicCap size={24} />
									</div>
									<div>
										<h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
											Professional Growth
										</h4>
										<p className="text-gray-600 dark:text-gray-400">
											Dedicated to supporting your professional journey from your first day in college to industry leadership.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
