import { useProductStore } from '../features/product/product.store';
import { useCartStore } from '../features/cart/cart.store';

export const useStore = () => ({
  products: useProductStore(),
  cart: useCartStore(),
});