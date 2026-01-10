import apiApp from "../../../shared/api/apiApp";

export const getNotifications = async () => {
	const response = await apiApp.get("/notifications");
	return response.data.data;
};

export const markAsRead = async (id) => {
	const response = await apiApp.patch(`/notifications/${id}/read`);
	return response.data.data;
};

export const markAllAsRead = async () => {
	const response = await apiApp.patch("/notifications/mark-all-read");
	return response.data.data;
};

export const deleteNotification = async (id) => {
	const response = await apiApp.delete(`/notifications/${id}`);
	return response.data.data;
};
