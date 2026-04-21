import { create } from 'zustand';
import * as api from './product.api';

// --- Create store for managing products ---
export const useProductStore = create((set) => ({
  products: [],

  // --- Fetch products from API and update state ---
  fetchProducts: async () => {
    const res = await api.fetchProducts();
    set({ products: res.data });
  },
}));