import axios from "axios";
import { getToken, removeToken } from "../utils";

const apiApp = axios.create({
	baseURL: "http://localhost:4000",
});

apiApp.interceptors.request.use((req) => {
	const token = getToken();
	if (token) {
		req.headers.Authorization = `Bearer ${token}`;
	}
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
