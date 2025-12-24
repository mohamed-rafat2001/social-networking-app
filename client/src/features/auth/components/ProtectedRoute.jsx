import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

const ProtectedRoute = () => {
	const { user, isLoading } = useUser();

	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950 transition-colors">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/welcome" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
