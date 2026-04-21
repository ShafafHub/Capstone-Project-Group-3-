import { api } from '../../services/api';

// --- Get cart details ---
export const getCart = () => api.get('/cart');
// --- Add item to cart ---
export const addToCart = (data) => api.post('/cart', data);
// --- Remove item from cart ---
export const removeFromCart = (id) => api.delete(`/cart/${id}`);