import React, { useState, useRef } from "react";
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
import { useUser } from "../../hooks/useUser";
import { useSocket } from "../../hooks/useSocket";
import { useNotifications } from "../../../features/notifications/hooks/useNotifications";
import NotificationList from "../../../features/notifications/components/NotificationList";
import { Avatar, Button, cn } from "../ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as userService from "../../../features/profile/services/userService";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../providers/ThemeProvider";
import { useClickOutside } from "../../hooks/useClickOutside";

const Header = ({ onMenuClick }) => {
	const { user } = useUser();
	const { onlineUsers } = useSocket();
	const { notifications } = useNotifications();
	const navigate = useNavigate();

	const unreadNotificationsCount =
		notifications?.filter((n) => !n.read && n.type !== "message").length || 0;
	const unreadMessagesCount =
		notifications?.filter((n) => !n.read && n.type === "message").length || 0;
	const location = useLocation();
	const { darkMode, toggleDarkMode } = useTheme();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showMessages, setShowMessages] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearchResults, setShowSearchResults] = useState(false);

	const userMenuRef = useRef(null);
	const notificationsRef = useRef(null);
	const messagesRef = useRef(null);
	const searchRef = useRef(null);

	useClickOutside(userMenuRef, () => setShowUserMenu(false));
	useClickOutside(notificationsRef, () => setShowNotifications(false));
	useClickOutside(messagesRef, () => setShowMessages(false));
	useClickOutside(searchRef, () => setShowSearchResults(false));

	const { data: searchResults, isLoading: isSearching } = useQuery({
		queryKey: ["users-search", searchTerm],
		queryFn: () => userService.searchUsers(searchTerm),
		enabled: searchTerm.trim().length >= 2,
	});

	const isLandingPage = location.pathname === "/";

	const queryClient = useQueryClient();

	const handleLogout = async () => {
		try {
			await userService.logout();
			queryClient.clear();
			// Force a full page reload to ensure all state is cleared
			window.location.href = "/welcome";
		} catch (error) {
			console.error("Logout failed:", error);
			// Fallback: Clear all cached data and redirect
			queryClient.clear();
			window.location.href = "/welcome";
		}
	};

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
					<Link to="/" className="flex items-center gap-2.5 group">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
							<svg
								className="w-5 h-5 text-white"
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
						<span className="hidden sm:block text-xl font-black tracking-tight text-slate-900 dark:text-white">
							Engi<span className="text-primary">Connect</span>
						</span>
					</Link>
				</div>

				{/* Landing Page Navigation */}
				{isLandingPage && (
					<nav className="hidden lg:flex items-center gap-8">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
							>
								{link.name}
							</a>
						))}
					</nav>
				)}

				{/* Middle Section: Search (Hidden on Mobile unless toggled) */}
				{user && !isLandingPage && (
					<div className="flex-1 max-w-xl hidden md:block" ref={searchRef}>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
								<HiSearch
									size={20}
									className="text-slate-400 dark:text-gray-500 group-focus-within:text-primary transition-colors"
								/>
							</div>
							<input
								type="text"
								className="block w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-gray-900/50 border-none rounded-2xl text-[15px] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-900 transition-all"
								placeholder="Search about users groups..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setShowSearchResults(true);
								}}
								onFocus={() => setShowSearchResults(true)}
							/>

							<AnimatePresence>
								{showSearchResults && searchTerm.trim().length >= 2 && (
									<motion.div
										initial={{ opacity: 0, y: 10, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 10, scale: 0.95 }}
										className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
									>
										{isSearching ? (
											<div className="p-8 text-center">
												<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
												<p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
													Searching profiles...
												</p>
											</div>
										) : searchResults?.data?.length > 0 ? (
											<div className="py-2">
												{searchResults.data.map((u) => (
													<Link
														key={u._id}
														to={`/profile/${u._id}`}
														className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
														onClick={() => {
															setShowSearchResults(false);
															setSearchTerm("");
														}}
													>
														<Avatar src={u.image?.secure_url} size="md" />
														<div className="min-w-0">
															<p className="font-bold text-slate-900 dark:text-white truncate">
																{u.firstName} {u.lastName}
															</p>
															<p className="text-sm text-slate-500 dark:text-gray-400 truncate">
																@{u.username || u.firstName.toLowerCase()}
															</p>
														</div>
													</Link>
												))}
											</div>
										) : (
											<div className="p-8 text-center">
												<div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
													<HiSearch size={24} className="text-slate-400" />
												</div>
												<p className="text-slate-500 dark:text-slate-400 font-medium">
													No engineers found matching "{searchTerm}"
												</p>
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
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

							<div className="relative" ref={notificationsRef}>
								<button
									onClick={() => {
										setShowNotifications(!showNotifications);
										setShowMessages(false);
									}}
									className={cn(
										"p-2.5 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative",
										showNotifications && "text-primary bg-primary/5"
									)}
								>
									<HiBell size={24} />
									{unreadNotificationsCount > 0 && (
										<span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
											{unreadNotificationsCount > 9
												? "9+"
												: unreadNotificationsCount}
										</span>
									)}
								</button>
								<AnimatePresence>
									{showNotifications && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											className="absolute top-full right-0 mt-2 w-[320px] sm:w-[400px] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
										>
											<NotificationList
												notifications={notifications.filter(
													(n) => n.type !== "message"
												)}
												onClose={() => setShowNotifications(false)}
												isDropdown={true}
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							<div className="relative" ref={messagesRef}>
								<button
									onClick={() => {
										setShowMessages(!showMessages);
										setShowNotifications(false);
									}}
									className={cn(
										"p-2.5 text-slate-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative",
										showMessages && "text-primary bg-primary/5"
									)}
								>
									<HiChatAlt size={24} />
									{unreadMessagesCount > 0 && (
										<span className="absolute top-2 right-2 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
											{unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
										</span>
									)}
								</button>
								<AnimatePresence>
									{showMessages && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											className="absolute top-full right-0 mt-2 w-[320px] sm:w-[400px] bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-[110]"
										>
											<NotificationList
												notifications={notifications.filter(
													(n) => n.type === "message" && !n.read
												)}
												onClose={() => setShowMessages(false)}
												isDropdown={true}
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							<button
								onClick={toggleDarkMode}
								className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
							>
								{darkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
							</button>

							<div className="relative ml-2" ref={userMenuRef}>
								<button
									onClick={() => setShowUserMenu(!showUserMenu)}
									className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-2xl transition-all active:scale-95"
								>
									<Avatar src={user?.image?.secure_url} size="sm" />
									<div className="hidden lg:block text-left">
										<p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-0.5">
											{user?.firstName}
										</p>
										<div className="flex items-center gap-1">
											<span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
											<span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
												Online
											</span>
										</div>
									</div>
								</button>

								<AnimatePresence>
									{showUserMenu && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110]"
										>
											<Link
												to={`/profile/${user?._id}`}
												className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
												onClick={() => setShowUserMenu(false)}
											>
												<HiUserCircle size={20} />
												<span className="flex-1">Profile</span>
											</Link>
											<div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
												{user?.userType?.charAt(0).toUpperCase() +
													user?.userType?.slice(1)}
												{user?.major &&
													` • ${
														user.major.charAt(0).toUpperCase() +
														user.major.slice(1)
													}`}
											</div>
											<button
												onClick={handleLogout}
												className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-slate-50 dark:border-gray-800"
											>
												<HiLogout size={20} />
												Sign Out
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</>
					) : (
						<div className="flex items-center gap-2 sm:gap-4">
							{!isLandingPage && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => navigate("/welcome")}
									className="text-slate-600 dark:text-slate-400 font-bold"
								>
									Sign In
								</Button>
							)}
							<Button
								size="sm"
								onClick={() => navigate("/welcome?tab=signup")}
								className="rounded-full px-6 font-black tracking-tight shadow-lg shadow-primary/25"
							>
								GET STARTED
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Search Overlay */}
			<AnimatePresence>
				{showMobileSearch && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="fixed inset-0 bg-white dark:bg-slate-900 z-[120] flex flex-col"
					>
						<div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
							<div className="flex-1 relative">
								<HiSearch
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
									size={20}
								/>
								<input
									type="text"
									autoFocus
									className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border-none rounded-xl text-[15px] focus:ring-2 focus:ring-primary/20 dark:text-white"
									placeholder="Search..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<button
								onClick={() => {
									setShowMobileSearch(false);
									setSearchTerm("");
								}}
								className="p-2 text-slate-500 font-bold text-sm"
							>
								Cancel
							</button>
						</div>

						{/* Mobile Search Results */}
						<div className="flex-1 overflow-y-auto p-4">
							{isSearching ? (
								<div className="p-8 text-center">
									<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
									<p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
										Searching profiles...
									</p>
								</div>
							) : searchTerm.trim().length >= 2 &&
							  searchResults?.data?.length > 0 ? (
								<div className="space-y-2">
									{searchResults.data.map((u) => (
										<Link
											key={u._id}
											to={`/profile/${u._id}`}
											className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
											onClick={() => {
												setShowMobileSearch(false);
												setSearchTerm("");
											}}
										>
											<Avatar src={u.image?.secure_url} size="md" />
											<div className="min-w-0">
												<p className="font-bold text-slate-900 dark:text-white truncate">
													{u.firstName} {u.lastName}
												</p>
												<p className="text-sm text-slate-500 dark:text-gray-400 truncate">
													@{u.username || u.firstName.toLowerCase()}
												</p>
											</div>
										</Link>
									))}
								</div>
							) : searchTerm.trim().length >= 2 ? (
								<div className="p-8 text-center">
									<div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
										<HiSearch size={24} className="text-slate-400" />
									</div>
									<p className="text-slate-500 dark:text-slate-400 font-medium">
										No engineers found matching "{searchTerm}"
									</p>
								</div>
							) : null}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile Menu */}
			<AnimatePresence>
				{showMobileMenu && (
					<motion.div
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						className="fixed inset-0 z-[200] bg-white dark:bg-slate-950 flex flex-col p-6 lg:hidden"
					>
						<div className="flex items-center justify-between mb-8">
							<Link
								to="/"
								className="flex items-center gap-2"
								onClick={() => setShowMobileMenu(false)}
							>
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-xl">S</span>
								</div>
								<span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
									SocialApp
								</span>
							</Link>
							<button
								onClick={() => setShowMobileMenu(false)}
								className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
							>
								<HiX size={24} />
							</button>
						</div>
						<nav className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<a
									key={link.name}
									href={link.href}
									onClick={() => setShowMobileMenu(false)}
									className="text-lg font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
								>
									{link.name}
								</a>
							))}
						</nav>
						<div className="mt-auto flex flex-col gap-3">
							{user ? (
								<Button
									onClick={() => {
										setShowMobileMenu(false);
										navigate("/feed");
									}}
									className="w-full py-4 rounded-xl font-bold"
								>
									Go to Feed
								</Button>
							) : (
								<>
									<Button
										variant="outline"
										onClick={() => {
											setShowMobileMenu(false);
											navigate("/welcome", { state: { mode: "login" } });
										}}
										className="w-full py-4 rounded-xl font-bold"
									>
										Log In
									</Button>
									<Button
										onClick={() => {
											setShowMobileMenu(false);
											navigate("/welcome", { state: { mode: "signup" } });
										}}
										className="w-full py-4 rounded-xl font-bold"
									>
										Join Now
									</Button>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Header;
