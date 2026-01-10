import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../shared/hooks/useUser";
import Header from "../../../shared/components/layout/Header";
import Footer from "../../../shared/components/layout/Footer";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Majors from "./Majors";
import Contact from "./Contact";
import LandingLoading from "./detail/LandingLoading";

const LandingPage = () => {
	const { user, isLoading } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && user) {
			navigate("/feed", { replace: true });
		}
	}, [user, isLoading, navigate]);

	if (isLoading) {
		return <LandingLoading />;
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
