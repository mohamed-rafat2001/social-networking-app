import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../../../shared/hooks/useUser";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Majors from "./Majors";
import Contact from "./Contact";
import { Spinner } from "../../../shared/components/UI";

const LandingPage = () => {
	const { user, isLoading } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && user) {
			navigate("/feed", { replace: true });
		}
	}, [user, isLoading, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
				<div className="relative flex items-center justify-center">
					<div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping"></div>
					<Spinner size="xl" />
				</div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mt-8 text-center"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Social App
					</h2>
					<p className="text-gray-500 dark:text-gray-400 font-medium">
						Connecting students together...
					</p>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
			<Header />
			<main>
				<Hero />
				<Features />
				<About />
				<Majors />
				<Contact />
			</main>
			<Footer />
		</div>
	);
};

export default LandingPage;
