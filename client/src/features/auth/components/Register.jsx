import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";

const Register = () => {
	const location = useLocation();
	const [isLogin, setIsLogin] = useState(true);

	useEffect(() => {
		if (location.state?.mode === "signup") {
			setIsLogin(false);
		} else if (location.state?.mode === "login") {
			setIsLogin(true);
		}
	}, [location.state]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
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
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
						{isLogin ? "Sign in to your account" : "Create your account"}
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
						{isLogin ? "Or " : "Already have an account? "}
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="font-medium text-primary hover:text-primary/80 transition-colors"
						>
							{isLogin ? "create a new account" : "sign in instead"}
						</button>
					</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.div
								key={isLogin ? "login" : "signup"}
								initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
								transition={{ duration: 0.3 }}
							>
								{isLogin ? <Login /> : <SignUp />}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Register;
