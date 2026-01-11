import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({
			jsxRuntime: "automatic",
		}),
	],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:4000",
				changeOrigin: true,
				secure: false,
			},
			"/socket.io": {
				target: "http://localhost:4000",
				ws: true,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		extensions: [".js", ".jsx", ".json"],
	},
	build: {
		outDir: "build",
	},
});
