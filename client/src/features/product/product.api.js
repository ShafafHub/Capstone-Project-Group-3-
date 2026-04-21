import { api } from '../../services/api';

// --- Fetch all products ---
export const fetchProducts = () => api.get('/products');

// --- Fetch a single product by ID ---
export const fetchProduct = (id) => api.get(`/products/${id}`);