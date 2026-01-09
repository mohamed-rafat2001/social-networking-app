import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import FeedPage from "../pages/FeedPage";
import MessagesPage from "../pages/MessagesPage";
import ChatDetailPage from "../pages/ChatDetailPage";
import ProfilePage from "../pages/ProfilePage";
import PostDetailPage from "../pages/PostDetailPage";
import NotificationsPage from "../pages/NotificationsPage";
import MainLayout from "../shared/components/layout/MainLayout";
import { ProtectedRoute } from "../features/auth";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/welcome",
		element: <AuthPage />,
	},
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{
						path: "/feed",
						element: <FeedPage />,
					},
					{
						path: "/notifications",
						element: <NotificationsPage />,
					},
					{
						path: "/messages",
						element: <MessagesPage />,
						children: [
							{
								path: ":chatId",
								element: <ChatDetailPage />,
							},
						],
					},
					{
						path: "/profile/:userId",
						element: <ProfilePage />,
					},
					{
						path: "/posts/:postId",
						element: <PostDetailPage />,
					},
				],
			},
		],
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
]);
