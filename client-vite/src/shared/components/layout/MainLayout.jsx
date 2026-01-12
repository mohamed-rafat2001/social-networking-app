import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationManager from "../../../features/notifications/components/NotificationManager";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

const MainLayout = () => {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const location = useLocation();

	const isMessagesPage = location.pathname.startsWith("/messages");

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
			<NotificationManager />
			<Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{isMobileSidebarOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileSidebarOpen(false)}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] lg:hidden"
						/>
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-[210] lg:hidden shadow-2xl p-4 flex flex-col"
						>
							<div className="flex items-center justify-between mb-6 px-2">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
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
									<span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
										Engi<span className="text-primary">Connect</span>
									</span>
								</div>
								<button
									onClick={() => setIsMobileSidebarOpen(false)}
									className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
								>
									<HiX size={24} />
								</button>
							</div>
							<div className="flex-1 overflow-y-auto">
								<Sidebar
									onMobileItemClick={() => setIsMobileSidebarOpen(false)}
								/>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<div className="flex-1 container mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-6 flex gap-0 sm:gap-6">
				<aside className="hidden lg:block w-64 xl:w-72 shrink-0">
					<div className="sticky top-24">
						<Sidebar onMobileItemClick={null} />
					</div>
				</aside>
				<main className="flex-1 bg-white dark:bg-gray-900 sm:rounded-2xl shadow-sm border-x sm:border border-slate-200 dark:border-gray-800 overflow-hidden xl:max-w-none">
					<Outlet />
				</main>
				{!isMessagesPage && (
					<aside className="hidden xl:block w-72 shrink-0">
						<div className="sticky top-24 space-y-6">
							{/* Right Sidebar - Trending or Suggestions */}
							<div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
								<h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
									Trending for Engineers
								</h3>
								<div className="space-y-4">
									<div className="group cursor-pointer">
										<p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
											Computer Science · Trending
										</p>
										<p className="font-bold text-slate-900 dark:text-white group-hover:underline">
											#React19_Released
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											1,234 Posts
										</p>
									</div>
									<div className="group cursor-pointer">
										<p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
											Civil Engineering · Trending
										</p>
										<p className="font-bold text-slate-900 dark:text-white group-hover:underline">
											#SmartBridges
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											856 Posts
										</p>
									</div>
									<div className="group cursor-pointer">
										<p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
											Mechanical · Trending
										</p>
										<p className="font-bold text-slate-900 dark:text-white group-hover:underline">
											#EV_Future
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											2,431 Posts
										</p>
									</div>
								</div>
							</div>

							{/* Suggestions */}
							<div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
								<h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
									Who to follow
								</h3>
								<div className="space-y-4">
									{/* Placeholder suggestions */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-10 h-10 rounded-full bg-primary/10" />
											<div>
												<p className="text-sm font-bold text-slate-900 dark:text-white">
													Dr. Sarah Chen
												</p>
												<p className="text-xs text-slate-500">@sarah_ai</p>
											</div>
										</div>
										<button className="text-xs font-bold text-primary hover:underline">
											Follow
										</button>
									</div>
								</div>
							</div>
						</div>
					</aside>
				)}
			</div>
		</div>
	);
};

export default MainLayout;
