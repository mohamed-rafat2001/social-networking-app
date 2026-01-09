import apiApp from "../../../shared/api/apiApp";

export const getChats = async () => {
	const response = await apiApp.get("/chats");
	return response.data;
};

export const getSingleChat = async (chatId) => {
	if (!chatId) return null;
	const response = await apiApp.get(`/chats/${chatId}`);
	return response.data;
};

export const createChat = async (userId) => {
	const response = await apiApp.post(`/chats`, { secondId: userId });
	return response.data;
};

export const deleteChat = async (chatId) => {
	const response = await apiApp.delete(`/chats/${chatId}`);
	return response.data;
};
