import apiApp from "../api/apiApp";

export const getMessages = async (chatId) => {
	if (!chatId) return [];
	const response = await apiApp.get(`/message/${chatId}`);
	return response.data;
};

export const createMessage = async ({ chatId, data }) => {
	const response = await apiApp.post(`/message/${chatId}`, data);
	return response.data;
};
