export const storeToken = (value) => {
	// Token is now stored in HTTP-only cookies
};

export const getToken = () => {
	// Token is inaccessible from JavaScript (HTTP-only)
	return null;
};

export const removeToken = () => {
	localStorage.removeItem("token");
};

export const formatDate = (date) => {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(new Date(date));
};
