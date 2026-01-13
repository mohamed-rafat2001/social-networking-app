import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { useSocket } from "./useSocket";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useTheme } from "../../providers/ThemeProvider";
import { useClickOutside } from "./useClickOutside";
import * as userService from "../../features/profile/services/userService";

export const useHeaderLogic = () => {
	const { user } = useUser();
	const { onlineUsers } = useSocket();
	const { notifications } = useNotifications();
	const navigate = useNavigate();
	const location = useLocation();
	const { darkMode, toggleDarkMode } = useTheme();
	const queryClient = useQueryClient();

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

	const unreadNotificationsCount =
		notifications?.filter((n) => !n.read && n.type !== "message").length || 0;
	const unreadMessagesCount =
		notifications?.filter((n) => !n.read && n.type === "message").length || 0;

	const isLandingPage = location.pathname === "/";

	const handleLogout = async () => {
		try {
			await userService.logout();
			queryClient.clear();
			window.location.href = "/";
		} catch (error) {
			console.error("Logout failed:", error);
			queryClient.clear();
			window.location.href = "/";
		}
	};

	return {
		user,
		onlineUsers,
		notifications,
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
	};
};
