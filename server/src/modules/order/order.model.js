// --- Create new order in database ---
export const createOrder = async (db, userId, items = [], total = 0) => {
  // --- Validate that items is an array ---
  if (!Array.isArray(items)) {
    throw new Error("items must be an array");
  }
  
  // --- Insert order and get the generated ID ---
  const [orderId] = await db('orders').insert({
    user_id: userId,
    total_price: total,
    status: 'pending'
  }).returning('id');

  // --- Map cart items to order_items structure ---
  const orderItems = items.map(item => ({
    order_id: orderId.id || orderId,
    product_id: item.product_id,
    quantity: item.quantity
  }));

  // --- Insert all order items ---
  await db('order_items').insert(orderItems);

  // --- Return the created order ID ---
  return orderId.id || orderId;
};

// --- Get all orders for a specific user, newest first ---
export const getOrders = (db, userId) => {
  return db('orders').where({ user_id: userId }).orderBy('id', 'desc');
};