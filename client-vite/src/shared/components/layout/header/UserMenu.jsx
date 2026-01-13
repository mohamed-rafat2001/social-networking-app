import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiUserCircle, HiLogout } from "react-icons/hi";
import { Avatar } from "../../ui";

const UserMenu = ({
	user,
	showUserMenu,
	setShowUserMenu,
	handleLogout,
	userMenuRef,
}) => {
	return (
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
							{user?.userType || "User"}
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
	);
};

export default UserMenu;
