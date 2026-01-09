import apiApp from "../../../shared/api/apiApp";

export const getChats = async () => {
	const response = await apiApp.get("/chats");
	return response.data;
};

export const getSingleChat = async (chatId) => {
	if (!chatId) return null;
	const response = await apiApp.get(`/chat/${chatId}`);
	return response.data;
};

export const createChat = async (userId) => {
	const response = await apiApp.post(`/chat`, { userId });
	return response.data;
};
