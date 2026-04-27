// --- create new order with items ---
export const createOrder = async (db, userId, items = [], total = 0) => {
  if (!Array.isArray(items)) {
    throw new Error("items must be an array");
  }

  const [orderId] = await db('orders')
    .insert({
      user_id: userId,
      total_price: total,
      status: 'pending',
    })
    .returning('id');

  const orderItems = items.map((item) => ({
    order_id: orderId.id || orderId,
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  await db('order_items').insert(orderItems);

  return orderId.id || orderId;
};

// --- get all orders (sorted by newest first) ---
export const getOrders = (db, userId) => {
  return db('orders')
    .where({ user_id: userId })
    .orderBy('id', 'desc');
};