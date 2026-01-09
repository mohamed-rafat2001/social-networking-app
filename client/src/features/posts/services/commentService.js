import apiApp from "../../../shared/api/apiApp";

export const addComment = async ({ postId, commentData }) => {
	const response = await apiApp.post(`/comments/${postId}`, commentData);
	return response.data;
};

export const likeComment = async ({ commentId }) => {
	const response = await apiApp.patch(`/comments/like/${commentId}`);
	return response.data;
};

export const getComment = async ({ commentId }) => {
	const response = await apiApp.get(`/comments/${commentId}`);
	return response.data;
};

export const addReply = async ({ commentId, replyData }) => {
	const response = await apiApp.post(`/replays/replay/${commentId}`, replyData);
	return response.data;
};

export const likeReply = async ({ replyId }) => {
	const response = await apiApp.patch(`/replays/replay/like/${replyId}`);
	return response.data;
};

export const updateComment = async ({ commentId, commentData }) => {
	const response = await apiApp.patch(`/comments/${commentId}`, commentData);
	return response.data;
};

export const deleteComment = async ({ commentId }) => {
	const response = await apiApp.delete(`/comments/${commentId}`);
	return response.data;
};

export const updateReply = async ({ replyId, replyData }) => {
	const response = await apiApp.patch(`/replays/replay/${replyId}`, replyData);
	return response.data;
};

export const deleteReply = async ({ replyId }) => {
	const response = await apiApp.delete(`/replays/replay/${replyId}`);
	return response.data;
};
