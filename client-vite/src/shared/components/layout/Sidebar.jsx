import React from "react";
import { NavLink } from "react-router-dom";
import {
	HiHome,
	HiChatAlt,
	HiUser,
	HiHashtag,
	HiCollection,
	HiBookmark,
	HiBell,
} from "react-icons/hi";
import { useUser } from "../../hooks/useUser";
import { useNotifications } from "../../../features/notifications/hooks/useNotifications";
import { useChats } from "../../../features/chat/hooks/useChatQueries";

const Sidebar = ({ onMobileItemClick }) => {
	const { user } = useUser();
	const { notifications } = useNotifications();
	const { data: chats } = useChats();

	const unreadNotificationsCount =
		notifications?.filter((n) => !n.isRead && !n.read)?.length || 0;
	const unreadMessagesCount =
		chats?.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0) || 0;

	const navItems = [
		{ name: "Home Feed", icon: HiHome, path: "/feed" },
		{ name: "Explore Topics", icon: HiHashtag, path: "/explore" },
		{
			name: "Notifications",
			icon: HiBell,
			path: "/notifications",
			badge: unreadNotificationsCount,
		},
		{
			name: "Messages",
			icon: HiChatAlt,
			path: "/messages",
			badge: unreadMessagesCount,
		},
		{ name: "Groups", icon: HiCollection, path: "/groups" },
		{ name: "Bookmarks", icon: HiBookmark, path: "/bookmarks" },
		{ name: "My Profile", icon: HiUser, path: `/profile/${user?._id}` },
	];

	return (
		<nav className="space-y-1">
			{navItems.map((item) => (
				<NavLink
					key={item.name}
					to={item.path}
					onClick={() => onMobileItemClick && onMobileItemClick()}
					className={({ isActive }) =>
						`flex items-center gap-4 px-4 py-3.5 text-[17px] font-bold rounded-2xl transition-all duration-200 group ${
							isActive
								? "bg-primary text-white shadow-lg shadow-primary/25"
								: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
						}`
					}
				>
					<div className="relative">
						<item.icon
							size={24}
							className="group-hover:scale-110 transition-transform duration-200 shrink-0"
						/>
						{item.badge > 0 && (
							<span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
								{item.badge > 9 ? "9+" : item.badge}
							</span>
						)}
					</div>
					<span className="lg:block">{item.name}</span>
				</NavLink>
			))}

			<div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 px-4">
				<h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
					preferred groups
				</h4>
				<div className="space-y-4">
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-sm">
							CS
						</div>
						<span className="text-[14px] font-bold text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
							Computer Science 2024
						</span>
					</button>
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 shadow-sm">
							ME
						</div>
						<span className="text-[14px] font-bold text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
							Mechanical Design
						</span>
					</button>
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-sm">
							AI
						</div>
						<span className="text-[14px] font-bold text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
							Artificial Intelligence
						</span>
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Sidebar;
