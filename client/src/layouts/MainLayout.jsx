import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
			<Header />
			<div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
				<aside className="hidden lg:block w-64 shrink-0">
					<div className="sticky top-24">
						<Sidebar />
					</div>
				</aside>
				<main className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
					<Outlet />
				</main>
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
										2,102 Posts
									</p>
								</div>
							</div>
							<button className="text-primary text-sm font-semibold mt-6 hover:underline">
								Show more
							</button>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default MainLayout;
