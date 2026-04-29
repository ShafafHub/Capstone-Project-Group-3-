import { create } from 'zustand';
import * as api from './category.api';

export const useCategoryStore = create((set) => ({
  // --- State ---
  categories: [],

  // --- Fetch all categories ---
  fetchCategories: async () => {
    const res = await api.fetchCategories();
    set({ categories: res.data || [] });
  },

  // --- Add new category ---
  addCategory: async (data) => {
    const res = await api.createCategory(data);
    set((state) => ({
      categories: [res.data, ...state.categories]
    }));
  },

  // --- Remove category by ID ---
  removeCategory: async (id) => {
    await api.deleteCategory(id);
    set((state) => ({
      categories: state.categories.filter(c => c.id !== id)
    }));
  }
}));