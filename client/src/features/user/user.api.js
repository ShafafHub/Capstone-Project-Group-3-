import { api } from '../../services/api';

// --- Fetch user profile from API ---
 export const getProfile = () => api.get('/user/profile');