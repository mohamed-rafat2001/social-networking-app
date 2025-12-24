import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	HiSearch,
	HiBell,
	HiChatAlt,
	HiUserCircle,
	HiLogout,
	HiMenu,
	HiX,
	HiMoon,
	HiSun,
} from "react-icons/hi";
import { useUser } from "../hooks/useUser";
import { Avatar, Button } from "../ui";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";

const Header = () => {
	const { user } = useUser();
	const navigate = useNavigate();
	const location = useLocation();
	const { darkMode, toggleDarkMode } = useTheme();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const isLandingPage = location.pathname === "/";

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.href = "/welcome";
	};

	const navLinks = [
		{ name: "Home", href: "#hero" },
		{ name: "Features", href: "#features" },
		{ name: "About", href: "#about" },
		{ name: "Majors", href: "#majors" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2 shrink-0">
					<div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>
					<span className="text-xl font-black tracking-tight text-gray-900 dark:text-white hidden sm:block">
						Engi<span className="text-primary">Connect</span>
					</span>
				</Link>

				{/* Landing Page Navigation */}
				{isLandingPage && !user && (
					<nav className="hidden lg:flex items-center gap-8">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
							>
								{link.name}
							</a>
						))}
					</nav>
				)}

				{/* Search Bar (Only for logged in users) */}
				{user && (
					<div className="flex-1 max-w-md relative hidden md:block">
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<HiSearch size={20} />
						</div>
						<input
							type="text"
							placeholder="Search for projects, students, or topics..."
							className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-2xl py-2 pl-10 pr-4 text-sm transition-all outline-none dark:text-white"
						/>
					</div>
				)}

				{/* Navigation Actions */}
				<div className="flex items-center gap-2 sm:gap-4">
					<button
						onClick={toggleDarkMode}
						className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
						title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
					>
						{darkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
					</button>

					{user ? (
						<>
							<button className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-colors relative">
								<HiBell size={24} />
								<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
							</button>
							<Link
								to="/messages"
								className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
							>
								<HiChatAlt size={24} />
							</Link>

							<div className="relative">
								<button
									onClick={() => setShowUserMenu(!showUserMenu)}
									className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
								>
									<div className="text-right hidden sm:block">
										<p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
											{user.firstName}
										</p>
										<p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
											Student
										</p>
									</div>
									<Avatar src={user.image?.secure_url} size="md" />
								</button>

								<AnimatePresence>
									{showUserMenu && (
										<>
											<div
												className="fixed inset-0 z-10"
												onClick={() => setShowUserMenu(false)}
											></div>
											<motion.div
												initial={{ opacity: 0, y: 10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.95 }}
												className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20"
											>
												<Link
													to={`/profile/${user._id}`}
													className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
												>
													<HiUserCircle size={20} className="text-gray-400" />
													<span className="font-medium">My Profile</span>
												</Link>
												<button
													onClick={handleLogout}
													className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
												>
													<HiLogout size={20} />
													<span className="font-medium">Sign Out</span>
												</button>
											</motion.div>
										</>
									)}
								</AnimatePresence>
							</div>
						</>
					) : (
						<div className="flex items-center gap-3">
							<Link to="/welcome" className="hidden sm:block">
								<Button
									variant="ghost"
									className="font-bold dark:text-gray-300 dark:hover:text-white"
								>
									Log In
								</Button>
							</Link>
							<Link to="/welcome">
								<Button className="rounded-xl px-6">Join Now</Button>
							</Link>
							{/* Mobile Menu Toggle */}
							{isLandingPage && (
								<button
									onClick={() => setShowMobileMenu(!showMobileMenu)}
									className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
								>
									{showMobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isLandingPage && !user && showMobileMenu && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
					>
						<div className="container mx-auto px-4 py-6 flex flex-col gap-4">
							{navLinks.map((link) => (
								<a
									key={link.name}
									href={link.href}
									onClick={() => setShowMobileMenu(false)}
									className="text-lg font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary py-2"
								>
									{link.name}
								</a>
							))}
							<hr className="border-gray-100 dark:border-gray-800 my-2" />
							<Link to="/welcome" onClick={() => setShowMobileMenu(false)}>
								<Button className="w-full rounded-xl py-4">Get Started</Button>
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Header;
