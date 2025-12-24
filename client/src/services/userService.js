import apiApp from "../api/apiApp";

export const getCurrentUser = async () => {
	const response = await apiApp.get("/user");
	return response.data;
};

export const login = async (credentials) => {
	const response = await apiApp.post("/user/login", credentials);
	return response.data;
};

export const signup = async (userData) => {
	const response = await apiApp.post("/user/signup", userData);
	return response.data;
};

export const getUserProfile = async (userId) => {
	if (!userId) return null;
	const response = await apiApp.get(`/user/${userId}`);
	return response.data;
};
