import apiApp from "../../../shared/api/apiApp";

export const getNotifications = async (page = 1, limit = 10) => {
	const response = await apiApp.get("/notifications", { params: { page, limit } });
	return response.data;
};

export const markAsRead = async (id) => {
	const response = await apiApp.patch(`/notifications/${id}/read`);
	return response.data.data;
};

export const markAllAsRead = async (type) => {
	const response = await apiApp.patch("/notifications/mark-all-read", null, {
		params: { type },
	});
	return response.data.data;
};

export const deleteNotification = async (id) => {
	const response = await apiApp.delete(`/notifications/${id}`);
	return response.data.data;
};
