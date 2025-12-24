import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import LandingPage from "./features/landing/components/LandingPage";
import Register from "./features/auth/components/Register";
import PostList from "./features/posts/components/PostList";
import ChatList from "./features/chat/components/ChatList";
import ChatWindow from "./features/chat/components/ChatWindow";
import ProfileDetail from "./features/profile/components/ProfileDetail";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import ScrollToTop from "./layouts/ScrollToTop";
import { useTheme } from "./providers/ThemeProvider";

function App() {
	const { darkMode } = useTheme();

	return (
		<BrowserRouter>
			<ScrollToTop />
			<Toaster
				position="bottom-right"
				gutter={8}
				containerStyle={{ margin: "16px" }}
				toastOptions={{
					success: { duration: 3000 },
					error: { duration: 5000 },
					style: {
						fontSize: "14px",
						maxWidth: "400px",
						padding: "12px 20px",
						backgroundColor: darkMode ? "#1f2937" : "#fff",
						color: darkMode ? "#f3f4f6" : "#374151",
						borderRadius: "12px",
						border: darkMode ? "1px solid #374151" : "none",
						boxShadow: darkMode
							? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)"
							: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
					},
				}}
			/>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<LandingPage />} />
				<Route path="/welcome" element={<Register />} />

				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route element={<MainLayout />}>
						<Route path="/feed" element={<PostList />} />
						<Route path="/messages" element={<ChatList />} />
						<Route path="/messages/:chatId" element={<ChatWindow />} />
						<Route path="/profile/:userId" element={<ProfileDetail />} />
					</Route>
				</Route>

				{/* 404 Route */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
