import React from "react";
import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";
import { Button } from "../../../shared/components/ui";

export const ContactForm = () => {
	return (
		<div className="lg:w-7/12">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				transition={{ delay: 0.2 }}
				className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative"
			>
				<div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
					<HiMail size={120} className="text-primary" />
				</div>

				<form className="relative z-10" onSubmit={(e) => e.preventDefault()}>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
						<div className="space-y-2">
							<label className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider ml-1">
								Your Name
							</label>
							<input
								type="text"
								className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none dark:text-white placeholder-gray-400"
								placeholder="Mohamed Rafat"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider ml-1">
								Email Address
							</label>
							<input
								type="email"
								className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none dark:text-white placeholder-gray-400"
								placeholder="hello@example.com"
							/>
						</div>
					</div>
					<div className="mb-10 space-y-2">
						<label className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider ml-1">
							Your Message
						</label>
						<textarea
							rows="5"
							className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none dark:text-white placeholder-gray-400 resize-none"
							placeholder="How can we help you today?"
						></textarea>
					</div>
					<Button className="w-full py-5 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300">
						Send Message
					</Button>
				</form>
			</motion.div>
		</div>
	);
};
