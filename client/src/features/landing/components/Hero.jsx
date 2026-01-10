import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/ui";

const Hero = () => {
	const navigate = useNavigate();
	return (
		<section
			id="hero"
			className="pt-20 pb-20 overflow-hidden relative transition-colors duration-500"
		>
			{/* Decorative elements */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
				<div className="absolute top-24 left-10 w-72 h-72 bg-blue-100 dark:bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
				<div
					className="absolute bottom-24 right-10 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40 animate-pulse"
					style={{ animationDelay: "2s" }}
				></div>
			</div>

			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row items-center justify-between gap-12">
					<div className="md:w-1/2 text-center md:text-left">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							<motion.span
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
								className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-primary/10 text-primary dark:text-primary-foreground text-xs font-bold rounded-full mb-6 tracking-wider uppercase border border-primary/10"
							>
								Engineering Student Network
							</motion.span>
							<h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
								Connecting the Future of{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600 dark:from-primary dark:via-blue-400 dark:to-indigo-400">
									Engineering
								</span>
							</h1>
							<p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
								The exclusive social platform for engineering students to
								collaborate, share resources, and build a professional network
								within the college community.
							</p>
							<div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
								<motion.div
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<Button
										onClick={() =>
											navigate("/welcome", { state: { mode: "signup" } })
										}
										className="px-10 py-4 text-lg w-full sm:w-auto rounded-2xl shadow-xl shadow-primary/20 dark:shadow-none bg-primary hover:bg-primary/90 transition-all duration-300"
									>
										Get Started Free
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
									className="w-full sm:w-auto"
								>
									<a href="#about">
										<Button
											variant="secondary"
											className="px-10 py-4 text-lg w-full sm:w-auto rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-primary/20 bg-white dark:bg-gray-800 dark:text-white transition-all duration-300"
										>
											Learn More
										</Button>
									</a>
								</motion.div>
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 1, duration: 1 }}
								className="mt-12 flex items-center justify-center md:justify-start gap-6"
							>
								<div className="flex -space-x-3">
									{[1, 2, 3, 4].map((i) => (
										<motion.div
											key={i}
											whileHover={{ zIndex: 10, scale: 1.1 }}
											className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer transition-transform"
										>
											<img
												src={`https://i.pravatar.cc/100?img=${i + 10}`}
												alt="User"
											/>
										</motion.div>
									))}
								</div>
								<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
									<span className="text-gray-900 dark:text-white font-bold">
										5,000+
									</span>{" "}
									students already joined
								</p>
							</motion.div>
						</motion.div>
					</div>

					<div className="md:w-1/2 relative">
						<motion.div
							initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
							animate={{ opacity: 1, scale: 1, rotate: 0 }}
							transition={{ duration: 1, delay: 0.3 }}
							className="relative z-10"
						>
							<div className="relative group">
								<div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
								<img
									src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
									alt="Engineering Students Collaboration"
									className="relative w-full max-w-xl mx-auto rounded-3xl shadow-2xl"
								/>
							</div>

							{/* Floating badges */}
							<motion.div
								animate={{ y: [0, -15, 0] }}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute top-10 -left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-700 flex items-center gap-3"
							>
								<div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
										Verified
									</p>
									<p className="text-sm font-black text-gray-900 dark:text-white">
										Student ID
									</p>
								</div>
							</motion.div>

							<motion.div
								animate={{ y: [0, 15, 0] }}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 0.5,
								}}
								className="absolute bottom-10 -right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-700 flex items-center gap-3"
							>
								<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-primary rounded-xl flex items-center justify-center">
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<div>
									<p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
										Community
									</p>
									<p className="text-sm font-black text-gray-900 dark:text-white">
										10+ Majors
									</p>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
