import { create } from 'zustand'
import * as api from './cart.api'

export const useCartStore = create((set, get) => ({
  // =====================
  // STATE
  // =====================
  cart: [],
  loading: false,
  error: null,

  editItem: null,

  // If set, checkout flow should use this instead of full cart
  buyNowItem: null,

  // =====================
  // FETCH CART
  // =====================
  fetchCart: async () => {
    set({ loading: true, error: null })

    try {
      const res = await api.getCart()
      set({ cart: res.data || [], loading: false })
    } catch (err) {
      console.error('fetchCart failed:', err)
      set({ error: err, loading: false })
    }
  },

  // Same as fetchCart, but without touching loading/error (useful after mutations)
  syncCartSilent: async () => {
    try {
      const res = await api.getCart()
      const next = res.data || []
      set({ cart: next })
      return next
    } catch (err) {
      console.error('syncCartSilent failed:', err)
      return null
    }
  },

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

  // =====================
  // ADD ITEM (OPTIMISTIC)
  // =====================
  addItem: async (item) => {
    const prevCart = get().cart

    const tempItem = {
      ...item,
      id: Date.now(), // temp id
    }

    // optimistic UI
    set({ cart: [...prevCart, tempItem] })

    try {
      await api.addToCart(item)
      // Always re-sync so we get the real server IDs (prevents "remove/change" issues)
      await get().syncCartSilent()
    } catch (err) {
      console.error('addItem failed:', err)
      set({ cart: prevCart })
    }
  },


  // =====================
  // UPDATE ITEM (EDIT)
  // =====================
  updateItem: async (id, newData) => {
    const prevCart = get().cart

    // optimistic update
    set({
      cart: prevCart.map((item) =>
        item.id === id ? { ...item, ...newData } : item
      ),
    })

    try {
      // Backend cart module currently doesn't expose an update endpoint.
      // Keep UI responsive with optimistic update only.
      await api.getCart?.()
    } catch (err) {
      console.error('updateItem failed:', err)
      set({ cart: prevCart })
    }
  },

  // =====================
  // REMOVE ITEM
  // =====================
removeItemLocal: (id) => {
  set((state) => ({
    cart: state.cart.filter((i) => (i.id ?? i.product_id) !== id),
    buyNowItem:
      state.buyNowItem && (state.buyNowItem.id ?? state.buyNowItem.product_id) === id
        ? null
        : state.buyNowItem,
  }))
},

removeItem: async (idOrItem) => {
  const prevCart = get().cart
  const item =
    typeof idOrItem === 'object' && idOrItem != null ? idOrItem : null
  const rawId = item ? (item.id ?? item.product_id) : idOrItem

  // Try to resolve the real server cart-row id
  const inCart = prevCart.find((i) => (i.id ?? i.product_id) === rawId)
  const resolvedId =
    inCart?.id ??
    prevCart.find(
      (i) =>
        (i.product_id ?? i.id) === rawId &&
        (item?.color ? i.color === item.color : true) &&
        (item?.size ? i.size === item.size : true)
    )?.id ??
    rawId

  // optimistic local remove
  set((state) => ({
    cart: state.cart.filter((i) => (i.id ?? i.product_id) !== rawId),
    buyNowItem:
      state.buyNowItem && (state.buyNowItem.id ?? state.buyNowItem.product_id) === rawId
        ? null
        : state.buyNowItem,
  }))

  try {
    await api.removeFromCart(resolvedId)
    await get().syncCartSilent()
  } catch (err) {
    console.error('removeItem failed:', err)
    set({ cart: prevCart })
  }
},

  // =====================
  // CLEAR CART (SERVER + LOCAL)
  // =====================
  clearCartServer: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.getCart()
      const items = res?.data || []

      await Promise.allSettled(
        items.map((item) => api.removeFromCart(item?.id ?? item?.product_id))
      )

      set({ cart: [], loading: false })
    } catch (err) {
      console.error('clearCartServer failed:', err)
      set({ error: err, loading: false })
    }
  },

  // =====================
  // EDIT FLOW (IMPORTANT)
  // =====================
  setEditItem: (item) => set({ editItem: item }),

  clearEditItem: () => set({ editItem: null }),

  // =====================
  // BUY NOW FLOW
  // =====================
  setBuyNowItem: (item) => set({ buyNowItem: item }),
  clearBuyNowItem: () => set({ buyNowItem: null }),

  // =====================
  // CLEAR CART
  // =====================
  clearCart: async () => {
    const prevCart = get().cart

    set({ cart: [] })

    try {
      // Backend cart module currently doesn't expose a clear endpoint.
      // Clearing is handled locally.
      await api.getCart?.()
    } catch (err) {
      console.error('clearCart failed:', err)
      set({ cart: prevCart })
    }
  },
}))