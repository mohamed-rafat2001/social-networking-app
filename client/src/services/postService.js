import apiApp from "../api/apiApp";

export const getPosts = async () => {
	const response = await apiApp.get("/posts");
	return response.data;
};

export const addPost = async ({ postData, onUploadProgress }) => {
	const response = await apiApp.post("/post", postData, {
		onUploadProgress: (progressEvent) => {
			if (onUploadProgress) {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				onUploadProgress(percentCompleted);
			}
		},
	});
	return response.data;
};

export const likePost = async (postId) => {
	const response = await apiApp.patch(`/post/like/${postId}`);
	return response.data;
};

export const sharePost = async (postId) => {
	const response = await apiApp.post(`/sharePost/${postId}`);
	return response.data;
};
