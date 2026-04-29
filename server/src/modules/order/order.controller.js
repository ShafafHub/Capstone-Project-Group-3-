import * as service from './order.service.js';

// --- Create new order ---
export const create = async (req, res) => {
  const db = req.app.locals.db;
  const { items, total } = req.body;

  const orderId = await service.placeOrder(
    db,
    req.user.id,
    items,
    total
  );

  res.json({ orderId });
};

// --- Get all orders (admin gets all, user gets only their own) ---
export const getAll = async (req, res) => {
  const db = req.app.locals.db;

  const orders = req.user.role === 'admin'
    ? await db('orders').orderBy('id', 'desc')
    : await service.getUserOrders(db, req.user.id);

  res.json(orders);
};