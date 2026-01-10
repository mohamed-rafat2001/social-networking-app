import apiApp from "../../../shared/api/apiApp";

export const getPosts = async () => {
	const response = await apiApp.get("/posts");
	return response.data;
};

export const addPost = async ({ postData, onUploadProgress }) => {
	const response = await apiApp.post("/posts", postData, {
		onUploadProgress: (progressEvent) => {
			if (onUploadProgress) {
				const total = progressEvent.total || 0;
				const current = progressEvent.loaded || 0;
				const percentCompleted =
					total > 0 ? Math.round((current * 100) / total) : 0;
				onUploadProgress(percentCompleted);
			}
		},
	});
	return response.data;
};

export const getSinglePost = async (postId) => {
	const response = await apiApp.get(`/posts/${postId}`);
	return response.data;
};

export const likePost = async (postId) => {
	const response = await apiApp.post(`/posts/${postId}/like`);
	return response.data;
};

export const sharePost = async ({ postId, note }) => {
	// If we have a note, we send it as a JSON request.
	// The server route is now updated to handle both JSON and multipart/form-data.
	const response = await apiApp.post(`/shares/sharePost/${postId}`, { note });
	return response.data;
};

export const incrementView = async (postId) => {
	const response = await apiApp.patch(`/posts/${postId}/increment-view`);
	return response.data;
};

export const updatePost = async ({ postId, postData }) => {
	const response = await apiApp.patch(`/posts/${postId}`, postData);
	return response.data;
};

export const deletePost = async (postId) => {
	const response = await apiApp.delete(`/posts/${postId}`);
	return response.data;
};
