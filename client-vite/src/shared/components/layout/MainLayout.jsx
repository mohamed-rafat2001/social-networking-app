import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationManager from "../../../features/notifications/components/NotificationManager";
import MobileSidebar from "./MobileSidebar";
import RightSidebar from "./RightSidebar";
import { useMainLayoutLogic } from "./useMainLayoutLogic";

const MainLayout = () => {
	const { isMobileSidebarOpen, isMessagesPage, toggleMobileSidebar } =
		useMainLayoutLogic();

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
			<NotificationManager />
			<Header onMenuClick={() => toggleMobileSidebar(true)} />

			<MobileSidebar
				isOpen={isMobileSidebarOpen}
				onClose={() => toggleMobileSidebar(false)}
			/>

			<div className="flex-1 container mx-auto px-0 sm:px-4 lg:px-6 py-0 sm:py-6 flex gap-0 sm:gap-6">
				<aside className="hidden lg:block w-64 xl:w-72 shrink-0">
					<div className="sticky top-24">
						<Sidebar onMobileItemClick={null} />
					</div>
				</aside>

				<main className="flex-1 bg-white dark:bg-gray-900 sm:rounded-2xl shadow-sm border-x sm:border border-slate-200 dark:border-gray-800 overflow-hidden xl:max-w-none">
					<Outlet />
				</main>

				{!isMessagesPage && <RightSidebar />}
			</div>
		</div>
	);
};

export default MainLayout;
