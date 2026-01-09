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
		chats?.filter((c) => c.unreadCount > 0)?.length || 0;

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
		{ name: "Projects", icon: HiCollection, path: "/projects" },
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
						`flex items-center gap-4 px-4 py-3 text-lg font-semibold rounded-2xl transition-all duration-200 group ${
							isActive
								? "bg-primary/10 text-primary dark:bg-primary/20"
								: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
						}`
					}
				>
					<div className="relative">
						<item.icon
							size={26}
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

			<div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 px-4">
				<h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
					Study Groups
				</h4>
				<div className="space-y-3">
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
							CS
						</div>
						<span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
							Computer Science 2024
						</span>
					</button>
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">
							ME
						</div>
						<span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
							Mechanical Design
						</span>
					</button>
					<button className="flex items-center gap-3 w-full text-left group">
						<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs group-hover:bg-green-600 group-hover:text-white transition-colors">
							AI
						</div>
						<span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
							AI & Robotics Club
						</span>
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Sidebar;
