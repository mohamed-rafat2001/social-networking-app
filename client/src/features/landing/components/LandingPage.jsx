import Header from "../../../layouts/Header";
import Footer from "../../../layouts/Footer";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Majors from "./Majors";
import Contact from "./Contact";

const LandingPage = () => {
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
