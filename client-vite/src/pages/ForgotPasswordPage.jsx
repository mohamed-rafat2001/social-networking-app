import React from "react";
import ForgotPassword from "../features/auth/components/ForgotPassword";
import { motion } from "framer-motion";
import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";

const ForgotPasswordPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
			<Header />
			<main className="flex-grow flex flex-col justify-center py-20 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<div className="flex justify-center">
						<div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
							<svg
								className="w-10 h-10 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<ForgotPassword />
						</motion.div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ForgotPasswordPage;
