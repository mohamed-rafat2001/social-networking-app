import React from "react";
import { motion } from "framer-motion";

export const ContactInfo = ({ infoItems, containerVariants, itemVariants }) => {
	return (
		<div className="lg:w-5/12">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
			>
				<span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold rounded-full mb-6 tracking-widest uppercase border border-white/10">
					Contact Us
				</span>
				<h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
					Have questions? <br />
					<span className="text-blue-200">We're here to help.</span>
				</h2>
				<p className="text-xl text-blue-100/80 mb-12 leading-relaxed">
					Our team is dedicated to providing the best experience for the
					engineering community. Reach out for support, feedback, or
					partnership opportunities.
				</p>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="space-y-8"
				>
					{infoItems.map((item, idx) => (
						<motion.div
							key={idx}
							variants={itemVariants}
							className="flex items-center gap-5 text-white group cursor-pointer"
						>
							<div className="w-14 h-14 bg-white/10 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
								<item.icon size={28} />
							</div>
							<div>
								<p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">
									{item.label}
								</p>
								<p className="text-lg font-medium group-hover:text-blue-100 transition-colors">
									{item.text}
								</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</motion.div>
		</div>
	);
};
