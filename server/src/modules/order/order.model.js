export const createOrder = async (db, userId, items, total) => {
  const result = await db.run(
    `INSERT INTO orders (user_id, total_price, status)
     VALUES (?, ?, ?)`,
    [userId, total, 'pending']
  );

  const orderId = result.lastID;

  for (let item of items) {
    await db.run(
      `INSERT INTO order_items (order_id, product_id, quantity)
       VALUES (?, ?, ?)`,
      [orderId, item.product_id, item.quantity]
    );
  }

  return orderId;
};

export const getOrders = (db, userId) => {
  return db.all(
    `SELECT * FROM orders WHERE user_id = ?`,
    [userId]
  );
};