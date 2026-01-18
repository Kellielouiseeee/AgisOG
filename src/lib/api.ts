import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add auth header if user is logged in
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('agis-user');
  if (userStr) {
    const user = JSON.parse(userStr);
    config.headers['x-user-id'] = user.id;
  }
  return config;
});

export default api;
