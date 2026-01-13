import React from "react";
import { HiMenu, HiSearch } from "react-icons/hi";
import { Button } from "../ui";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import Logo from "./header/Logo";
import DesktopNav from "./header/DesktopNav";
import SearchSection from "./header/SearchSection";
import ActionIcons from "./header/ActionIcons";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";

const Header = ({ onMenuClick }) => {
	const {
		user,
		unreadNotificationsCount,
		unreadMessagesCount,
		darkMode,
		toggleDarkMode,
		showUserMenu,
		setShowUserMenu,
		showNotifications,
		setShowNotifications,
		showMessages,
		setShowMessages,
		showMobileMenu,
		setShowMobileMenu,
		showMobileSearch,
		setShowMobileSearch,
		searchTerm,
		setSearchTerm,
		showSearchResults,
		setShowSearchResults,
		searchResults,
		isSearching,
		userMenuRef,
		notificationsRef,
		messagesRef,
		searchRef,
		isLandingPage,
		handleLogout,
		navigate,
	} = useHeaderLogic();

	const navLinks = [
		{ name: "Home", href: "#hero" },
		{ name: "Features", href: "#features" },
		{ name: "About", href: "#about" },
		{ name: "Majors", href: "#majors" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<header className="sticky top-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
			<div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
				{/* Left Section: Mobile Menu & Logo */}
				<div className="flex items-center gap-2 sm:gap-4 shrink-0">
					{(user || isLandingPage) && (
						<button
							onClick={() => {
								if (isLandingPage) {
									setShowMobileMenu(true);
								} else if (onMenuClick) {
									onMenuClick();
								}
							}}
							className="lg:hidden p-2 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-95"
							aria-label="Open Menu"
						>
							<HiMenu size={24} />
						</button>
					)}
					<Logo />
				</div>

				{/* Landing Page Navigation */}
				{isLandingPage && <DesktopNav navLinks={navLinks} />}

				{/* Middle Section: Search */}
				{user && !isLandingPage && (
					<SearchSection
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						showSearchResults={showSearchResults}
						setShowSearchResults={setShowSearchResults}
						isSearching={isSearching}
						searchResults={searchResults}
						searchRef={searchRef}
					/>
				)}

				{/* Right Section: Actions & User */}
				<div className="flex items-center gap-1 sm:gap-3 shrink-0">
					{user ? (
						<>
							<button
								onClick={() => setShowMobileSearch(!showMobileSearch)}
								className="md:hidden p-2.5 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
							>
								<HiSearch size={22} />
							</button>

							<ActionIcons
								showNotifications={showNotifications}
								setShowNotifications={setShowNotifications}
								showMessages={showMessages}
								setShowMessages={setShowMessages}
								unreadNotificationsCount={unreadNotificationsCount}
								unreadMessagesCount={unreadMessagesCount}
								darkMode={darkMode}
								toggleDarkMode={toggleDarkMode}
								notificationsRef={notificationsRef}
								messagesRef={messagesRef}
							/>

							<UserMenu
								user={user}
								showUserMenu={showUserMenu}
								setShowUserMenu={setShowUserMenu}
								handleLogout={handleLogout}
								userMenuRef={userMenuRef}
							/>
						</>
					) : (
						<div className="flex items-center gap-2 sm:gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									navigate("/welcome", { state: { mode: "login" } })
								}
								className="text-slate-600 dark:text-slate-400 font-bold"
							>
								Sign In
							</Button>
							<Button
								size="sm"
								onClick={() =>
									navigate("/welcome", { state: { mode: "signup" } })
								}
								className="rounded-full px-6 font-black tracking-tight shadow-lg shadow-primary/25"
							>
								JOIN NOW
							</Button>
						</div>
					)}
				</div>
			</div>

			<MobileMenu
				showMobileSearch={showMobileSearch}
				setShowMobileSearch={setShowMobileSearch}
				showMobileMenu={showMobileMenu}
				setShowMobileMenu={setShowMobileMenu}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				isSearching={isSearching}
				searchResults={searchResults}
				user={user}
				navLinks={navLinks}
				navigate={navigate}
			/>
		</header>
	);
};

export default Header;
