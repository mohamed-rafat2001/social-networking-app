import axios from "axios";
import { getToken } from "../utils";
const apiApp = axios.create({
	baseURL: "http://localhost:4000",
});
apiApp.interceptors.request.use((req) => {
	if (JSON.parse(localStorage.getItem("token"))) {
		req.headers.Authorization = `Bearer ${getToken()}`;
	}
	return req;
});
export default apiApp;
