import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mcplus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const getMe = () => API.get('/auth/me');

export const getMentors = (params) => API.get('/mentors', { params });
export const getMentor = (id) => API.get(`/mentors/${id}`);
export const addMentorResource = (title) => API.post('/mentors/me/resources', { title });

export const getRequests = () => API.get('/requests');
export const createRequest = (requestData) => API.post('/requests', requestData);
export const updateRequestStatus = (id, status) => API.patch(`/requests/${id}/status`, { status });

export const getSessions = () => API.get('/sessions');
export const createSession = (sessionData) => API.post('/sessions', sessionData);

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const updateAdminUserStatus = (id, status) => API.patch(`/admin/users/${id}/status`, { status });

export default API;
