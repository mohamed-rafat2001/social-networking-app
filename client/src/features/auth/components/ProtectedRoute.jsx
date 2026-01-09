import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../../shared/hooks/useUser";
import { Spinner } from "../../../shared/components/UI";
import { motion } from "framer-motion";

const ProtectedRoute = () => {
	const { user, isLoading } = useUser();

	if (isLoading) {
		return (
			<div className="flex flex-col h-screen w-full items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
				<div className="relative flex items-center justify-center">
					<div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-ping"></div>
					<Spinner size="xl" />
				</div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mt-8 text-center"
				>
					<p className="text-gray-500 dark:text-gray-400 font-medium">
						Verifying your session...
					</p>
				</motion.div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/welcome" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
