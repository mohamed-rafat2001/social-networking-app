import React from "react";
import { AnimatePresence } from "framer-motion";
import MobileSearchOverlay from "./MobileSearchOverlay";
import MobileMenuOverlay from "./MobileMenuOverlay";

const MobileMenu = ({
	showMobileSearch,
	setShowMobileSearch,
	showMobileMenu,
	setShowMobileMenu,
	searchTerm,
	setSearchTerm,
	isSearching,
	searchResults,
	user,
	navLinks,
	navigate,
}) => {
	return (
		<>
			<AnimatePresence>
				{showMobileSearch && (
					<MobileSearchOverlay
						showMobileSearch={showMobileSearch}
						setShowMobileSearch={setShowMobileSearch}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						isSearching={isSearching}
						searchResults={searchResults}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showMobileMenu && (
					<MobileMenuOverlay
						showMobileMenu={showMobileMenu}
						setShowMobileMenu={setShowMobileMenu}
						user={user}
						navLinks={navLinks}
						navigate={navigate}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default MobileMenu;
