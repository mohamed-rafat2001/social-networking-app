import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "./store";
import { router } from "./routing/Router";
import { SocketProvider } from "./providers/SocketProvider";
import { ThemeProvider, useTheme } from "./providers/ThemeProvider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: 1,
		},
	},
});

function AppContent() {
	const { darkMode } = useTheme();

	return (
		<>
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
			<RouterProvider router={router} />
		</>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<ThemeProvider>
					<SocketProvider>
						<AppContent />
					</SocketProvider>
				</ThemeProvider>
			</Provider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
