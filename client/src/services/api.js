import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// --- Request interceptor to add auth token ---
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});