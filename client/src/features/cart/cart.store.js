import { create } from 'zustand';
import * as api from './cart.api';

export const useCartStore = create((set, get) => ({
  cart: [],

  // --- Fetch cart details from API ---
  fetchCart: async () => {
    try {
      const res = await api.getCart();
      set({ cart: res.data });
    } catch (err) {
      console.error('fetchCart failed:', err);
    }
  },

  // --- Add item to cart ---
  addItem: async (item) => {
    const prevCart = get().cart;

     const payload = {
    productId: item.productId,
    quantity: item.quantity,
  };

    set({
      cart: [
        ...prevCart,
        {
          id: Date.now(),
          ...item,
        },
      ],
    });

    try {
      await api.addToCart(payload);

      const res = await api.getCart();
      set({ cart: res.data });

    } catch (err) {
      console.error('addItem failed:', err);

      set({ cart: prevCart });
    }
  },

  // --- Remove item from cart ---
  removeItem: async (id) => {
    const prevCart = get().cart;

    set({
      cart: prevCart.filter((i) => i.id !== id),
    });

    try {
      await api.removeFromCart(id);
    } catch (err) {
      console.error('removeItem failed:', err);

      set({ cart: prevCart });
    }
  },

  // --- Clear all items from cart ---
  clearCart: async () => {
    const prevCart = get().cart;

    set({ cart: [] });

    try {
    } catch (err) {
      console.error('clearCart failed:', err);
      set({ cart: prevCart });
    }
  },
}));