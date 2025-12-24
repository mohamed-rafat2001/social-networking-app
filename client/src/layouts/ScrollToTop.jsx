import React, { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled up to given distance
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Set the top coordinate to 0
	// make scrolling smooth
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-2xl shadow-blue-400 focus:outline-none focus:ring-4 focus:ring-primary/20"
					aria-label="Scroll to top"
				>
					<HiArrowUp size={24} strokeWidth={2} />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTop;
