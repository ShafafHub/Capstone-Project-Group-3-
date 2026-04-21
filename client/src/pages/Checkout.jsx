import { useCartStore } from '../features/cart/cart.store';
import { createOrder } from '../features/order/order.api';

// --- Getting cart items and clearCart from store ---
export default function Checkout() {
  const { cart, clearCart } = useCartStore();

  // --- Handle Checkout ---
  const handleCheckout = async () => {
    const items = cart.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    }));

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const res = await createOrder({ items, total });
    clearCart();

    console.log('Order created:', res.data);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}