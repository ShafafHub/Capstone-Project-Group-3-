import { useEffect, useState } from 'react';
import { getOrders } from '../features/order/order.api';

 
export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  // --- Fetching orders and setting state ---
  useEffect(() => {
    getOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h1>My Orders</h1>

      {orders.map((o) => (
        <div key={o.id}>
          <p>Order #{o.id}</p>
          <p>Total: {o.total_price}</p>
        </div>
      ))}
    </div>
  );
}