export const storeToken = (value) => {
	localStorage.setItem("token", JSON.stringify(value));
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  try {
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error('Error parsing token from localStorage', error);
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};
