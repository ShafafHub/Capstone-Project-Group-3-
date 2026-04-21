import { api } from '../../services/api';

// --- Create a new order ---
export const createOrder = (data) => api.post('/orders', data);
// --- Fetch all orders ---
export const getOrders = () => api.get('/orders');