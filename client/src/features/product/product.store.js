import { create } from 'zustand';
import * as api from './product.api';

export const useProductStore = create((set) => ({
  // --- State ---
  products: [],
  loading: false,
  error: null,

  // --- Fetch all products ---
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.fetchProducts();

      set({
        products: res.data || [],
        loading: false
      });
    } catch (err) {
      console.error('fetchProducts error:', err);

      set({
        error: 'Failed to load products',
        loading: false,
        products: []
      });
    }
  },

  // --- Add new product ---
  addProduct: async (data) => {
    try {
      const res = await api.createProduct(data);

      set((state) => ({
        products: [res.data, ...state.products]
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // --- Remove product by ID ---
  removeProduct: async (id) => {
    await api.deleteProduct(id);
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    }));
  }
}));