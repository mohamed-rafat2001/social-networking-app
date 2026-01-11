import axios from "axios";

const apiApp = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:4000/"}api/v1`,
	withCredentials: true,
});

apiApp.interceptors.request.use((req) => {
	return req;
});

apiApp.interceptors.response.use(
	(response) => response,
	(error) => {
		// Global error level for errors other than 401
		// (401 is handled specifically in getCurrentUser to prevent query loops)
		return Promise.reject(error);
	}
);

export default apiApp;
