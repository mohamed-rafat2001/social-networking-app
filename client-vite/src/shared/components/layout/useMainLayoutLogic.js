import { useState } from "react";
import { useLocation } from "react-router-dom";

export const useMainLayoutLogic = () => {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const location = useLocation();

	const isMessagesPage = location.pathname.startsWith("/messages");

	const toggleMobileSidebar = (open) => {
		setIsMobileSidebarOpen(open);
	};

	return {
		isMobileSidebarOpen,
		isMessagesPage,
		toggleMobileSidebar,
	};
};
