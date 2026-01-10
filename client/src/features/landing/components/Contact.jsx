import { motion } from "framer-motion";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { Button } from "../../../shared/components/ui";

const Contact = () => {
	const infoItems = [
		{
			icon: HiMail,
			text: "hello@engiconnect.edu",
			label: "Email Us",
		},
		{
			icon: HiPhone,
			text: "+1 (555) 123-4567",
			label: "Call Us",
		},
		{
			icon: HiLocationMarker,
			text: "Engineering Block A, University Campus",
			label: "Visit Us",
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
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<section id="contact" className="py-24 relative overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="bg-primary rounded-[3.5rem] p-8 md:p-16 lg:p-20 overflow-hidden relative shadow-2xl shadow-primary/20">
					{/* Background Decorations */}
					<div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
					<div
						className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse"
						style={{ animationDelay: "2s" }}
					></div>

					<div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
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

								<form className="relative z-10">
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
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
