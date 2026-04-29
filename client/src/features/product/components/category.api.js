import { api } from '../../services/api';

export const fetchCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);