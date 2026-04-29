import { api } from '../../services/api';

export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const fetchProducts = () => api.get('/products');
export const fetchProduct = (id) => api.get(`/products/${id}`);