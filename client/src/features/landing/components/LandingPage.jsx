import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Majors from "./Majors";
import Contact from "./Contact";

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
			<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
