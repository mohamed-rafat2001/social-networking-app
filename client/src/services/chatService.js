import apiApp from "../api/apiApp";

export const getChats = async () => {
	const response = await apiApp.get("/chats");
	return response.data;
};

export const getSingleChat = async (chatId) => {
	if (!chatId) return null;
	const response = await apiApp.get(`/chat/${chatId}`);
	return response.data;
};
