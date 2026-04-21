import { useEffect } from 'react';
import { useCartStore } from '../features/cart/cart.store';

export default function Cart() {
  const { cart, fetchCart, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <h1>Cart</h1>

      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <button onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}