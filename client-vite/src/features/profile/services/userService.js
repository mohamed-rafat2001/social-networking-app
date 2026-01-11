import apiApp from "../../../shared/api/apiApp";

export const getCurrentUser = async () => {
	try {
		const response = await apiApp.get("/user/user");
		return response.data;
	} catch (error) {
		// If 401, it means the user is simply not logged in.
		// We return a structure that indicates "no user" rather than throwing,
		// which allows React Query to cache this "not logged in" state as a success.
		if (error.response?.status === 401) {
			return { data: null };
		}
		throw error;
	}
};

export const login = async (credentials) => {
	const response = await apiApp.post("/user/login", credentials);
	return response.data;
};

export const signup = async (userData) => {
	const response = await apiApp.post("/user/signup", userData);
	return response.data;
};

export const logout = async () => {
	const response = await apiApp.get("/user/logout");
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
	const response = await apiApp.post(`/follows/follow/${userId}`);
	return response.data;
};

export const unfollowUser = async (userId) => {
	const response = await apiApp.post(`/follows/unfollow/${userId}`);
	return response.data;
};

export const blockUser = async (userId) => {
	const response = await apiApp.post(`/blocks/block/${userId}`);
	return response.data;
};

export const unblockUser = async (userId) => {
	const response = await apiApp.post(`/blocks/unblock/${userId}`);
	return response.data;
};

export const getBlockedUsers = async () => {
	const response = await apiApp.get("/blocks");
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

export const updateProfile = async (userData) => {
	const response = await apiApp.patch("/user/profile", userData);
	return response.data;
};

export const forgotPassword = async (email) => {
	const response = await apiApp.post("/user/forgotPassword", { email });
	return response.data;
};

export const resetPassword = async (resetData) => {
	const response = await apiApp.patch("/user/resetPassword", resetData);
	return response.data;
};

export const updateProfileImageDirect = async (formData) => {
	const response = await apiApp.post("/user/profileImg", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};
