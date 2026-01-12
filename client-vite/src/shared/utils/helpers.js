export const formatDate = (date) => {
	if (!date) return "";
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(new Date(date));
};
