import { api } from '../../services/api';

// --- Login request ---
export const login = (data) => api.post('/auth/login', data);
// --- Register request ---
export const register = (data) => api.post('/auth/register', data);