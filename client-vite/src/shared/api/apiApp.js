import axios from "axios";
import { getToken, removeToken } from "../utils/helpers";

const apiApp = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
	withCredentials: true,
});

apiApp.interceptors.request.use((req) => {
	return req;
});

apiApp.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			removeToken();
			// Optional: window.location.href = '/welcome';
		}
		return Promise.reject(error);
	}
);

export default apiApp;
