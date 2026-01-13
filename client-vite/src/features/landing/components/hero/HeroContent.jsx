import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/components/ui";

const HeroContent = () => {
	const navigate = useNavigate();

	return (
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
				<h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
					Connecting All Engineers{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600 dark:from-primary dark:via-blue-400 dark:to-indigo-400">
						Worldwide
					</span>
				</h1>
				<p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
					The premier social platform designed to make all engineers connected
					with together. Share experiences, collaborate on projects, and grow
					your professional network with engineering majors from around the
					globe.
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
								className="px-10 py-4 text-lg w-full sm:w-auto rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary/20 bg-white dark:bg-slate-800 dark:text-white transition-all duration-300"
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
								className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer transition-transform"
							>
								<img
									src={`https://i.pravatar.cc/100?img=${i + 10}`}
									alt="User"
								/>
							</motion.div>
						))}
					</div>
					<p className="text-sm font-medium text-slate-500 dark:text-slate-400">
						<span className="text-slate-900 dark:text-white font-bold">
							5,000+
						</span>{" "}
						students already joined
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default HeroContent;
