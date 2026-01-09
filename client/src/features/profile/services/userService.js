import apiApp from "../../../shared/api/apiApp";

export const getCurrentUser = async () => {
	const response = await apiApp.get("/user/user");
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

export const searchUsers = async (searchTerm) => {
	const response = await apiApp.get(`/user/search?name=${searchTerm}`);
	return response.data;
};

export const followUser = async (userId) => {
	const response = await apiApp.post(`/user/follow/${userId}`);
	return response.data;
};

export const unfollowUser = async (userId) => {
	const response = await apiApp.post(`/user/unfollow/${userId}`);
	return response.data;
};

export const updateProfileImage = async (formData, onProgress) => {
	const response = await apiApp.post("/user/profileImg", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		onUploadProgress: (progressEvent) => {
			if (progressEvent.total) {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				if (onProgress) onProgress(percentCompleted);
			} else {
				// If total is unknown, just send back the loaded amount or a fallback
				if (onProgress) onProgress(0);
			}
		},
	});
	return response.data;
};

export const deleteProfileImage = async () => {
	const response = await apiApp.delete("/user/profileImg");
	return response.data;
};
