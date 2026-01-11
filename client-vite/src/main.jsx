import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// Suppress console logs in production to prevent leaking details in the client
if (import.meta.env.PROD) {
	console.log = () => {};
	console.error = () => {};
	console.debug = () => {};
	console.warn = () => {};
	console.info = () => {};

	// Also suppress global window errors in production console
	window.onerror = () => true;
	window.onunhandledrejection = () => true;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
