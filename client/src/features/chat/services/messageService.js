import apiApp from "../../../shared/api/apiApp";

export const getMessages = async (chatId) => {
	if (!chatId) return [];
	const response = await apiApp.get(`/messages/${chatId}`);
	return response.data;
};

export const createMessage = async ({ chatId, data }) => {
	const response = await apiApp.post(`/messages/${chatId}`, data, {
		headers: {
			"Content-Type":
				data instanceof FormData ? "multipart/form-data" : "application/json",
		},
	});
	return response.data;
};
