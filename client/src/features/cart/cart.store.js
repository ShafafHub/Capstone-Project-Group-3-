import { create } from 'zustand';
import * as api from './cart.api';

export const useCartStore = create((set, get) => ({
  // STATE
  cart: [],
  loading: false,
  error: null,

  editItem: null,

  // If set, checkout flow should use this instead of full cart
  buyNowItem: null,

  // FETCH CART
  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.getCart();
      set({ cart: res.data || [], loading: false });
    } catch (err) {
      console.error('fetchCart failed:', err);
      set({ error: err, loading: false });
    }
  },

  // UPDATE QUANTITY
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        (item.id ?? item.product_id) === id
          ? { ...item, quantity }
          : item
      ),
      buyNowItem:
        state.buyNowItem && (state.buyNowItem.id ?? state.buyNowItem.product_id) === id
          ? { ...state.buyNowItem, quantity }
          : state.buyNowItem,
    })),

  // RESET QUANTITY TO 1
  resetQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        (item.id ?? item.product_id) === id
          ? { ...item, quantity: 1 }
          : item
      ),
      buyNowItem:
        state.buyNowItem && (state.buyNowItem.id ?? state.buyNowItem.product_id) === id
          ? { ...state.buyNowItem, quantity: 1 }
          : state.buyNowItem,
    })),  

  // ADD ITEM (OPTIMISTIC)
  addItem: async (item) => {
    const prevCart = get().cart;

    const tempItem = {
      ...item,
      id: Date.now(), // temp id
    };

    // optimistic UI
    set({ cart: [...prevCart, tempItem] });

    try {
      const res = await api.addToCart(item);

      // If backend returns an id, sync it
      const realItem = res?.data;

      if (realItem?.id) {
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === tempItem.id ? realItem : i
          ),
        }));
      }
    } catch (err) {
      console.error('addItem failed:', err);
      set({ cart: prevCart });
    }
  },

  // UPDATE ITEM (EDIT)
  updateItem: async (id, newData) => {
    const prevCart = get().cart;

    // optimistic update
    set({
      cart: prevCart.map((item) =>
        item.id === id ? { ...item, ...newData } : item
      ),
    });

    try {
      await api.getCart?.();
    } catch (err) {
      console.error('updateItem failed:', err);
      set({ cart: prevCart });
    }
  },

  // REMOVE ITEM (LOCAL ONLY)
  removeItemLocal: (id) => {
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    }));
  },

  // REMOVE ITEM (SERVER)
  removeItem: async (id) => {
    try {
      await api.removeFromCart(id);
    } catch (err) {
      console.error('removeItem failed:', err);
    }
  },

  // CLEAR CART (SERVER + LOCAL)
  clearCartServer: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.getCart();
      const items = res?.data || [];

      await Promise.allSettled(
        items.map((item) => api.removeFromCart(item?.id ?? item?.product_id))
      );

      set({ cart: [], loading: false });
    } catch (err) {
      console.error('clearCartServer failed:', err);
      set({ error: err, loading: false });
    }
  },

  // EDIT FLOW
  setEditItem: (item) => set({ editItem: item }),
  clearEditItem: () => set({ editItem: null }),

  // BUY NOW FLOW
  setBuyNowItem: (item) => set({ buyNowItem: item }),
  clearBuyNowItem: () => set({ buyNowItem: null }),

  // CLEAR CART (LOCAL)
  clearCart: async () => {
    const prevCart = get().cart;

    set({ cart: [] });

    try {
      // Clearing is handled locally.
      await api.getCart?.();
    } catch (err) {
      console.error('clearCart failed:', err);
      set({ cart: prevCart });
    }
  },
}));