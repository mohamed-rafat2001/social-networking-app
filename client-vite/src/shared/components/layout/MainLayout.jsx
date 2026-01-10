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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
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
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
						/>
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-[70] lg:hidden shadow-2xl p-4 flex flex-col"
						>
							<div className="flex items-center justify-between mb-6 px-2">
								<span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
									Engi<span className="text-primary">Connect</span>
								</span>
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

			<div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
				<aside className="hidden lg:block w-64 shrink-0">
					<div className="sticky top-24">
						<Sidebar onMobileItemClick={null} />
					</div>
				</aside>
				<main
					className={`flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${
						isMessagesPage ? "xl:max-w-none" : ""
					}`}
				>
					<Outlet />
				</main>
				{!isMessagesPage && (
					<aside className="hidden xl:block w-80 shrink-0">
						<div className="sticky top-24 space-y-6">
							{/* Right Sidebar - Trending or Suggestions */}
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
								<h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
									Trending for Engineers
								</h3>
								<div className="space-y-4">
									<div className="group cursor-pointer">
										<p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
											Computer Science · Trending
										</p>
										<p className="font-bold text-gray-900 dark:text-white group-hover:underline">
											#React19_Released
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											1,234 Posts
										</p>
									</div>
									<div className="group cursor-pointer">
										<p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
											Civil Engineering · Trending
										</p>
										<p className="font-bold text-gray-900 dark:text-white group-hover:underline">
											#SmartBridges
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											856 Posts
										</p>
									</div>
									<div className="group cursor-pointer">
										<p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
											Mechanical · Trending
										</p>
										<p className="font-bold text-gray-900 dark:text-white group-hover:underline">
											#EV_Future
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											2,431 Posts
										</p>
									</div>
								</div>
							</div>

							{/* Suggestions */}
							<div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
								<h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
									Who to follow
								</h3>
								<div className="space-y-4">
									{/* Placeholder suggestions */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="w-10 h-10 rounded-full bg-primary/10" />
											<div>
												<p className="text-sm font-bold text-gray-900 dark:text-white">
													Dr. Sarah Chen
												</p>
												<p className="text-xs text-gray-500">@sarah_ai</p>
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
