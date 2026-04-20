import * as service from './order.service.js';
import { dbPromise } from '../../config/db.js';

export const create = async (req, res) => {
  const db = await dbPromise;
  const { items, total } = req.body;

  const orderId = await service.placeOrder(
    db,
    req.user.id,
    items,
    total
  );

  res.json({ orderId });
};

export const getAll = async (req, res) => {
  const db = await dbPromise;
  const orders = await service.getUserOrders(db, req.user.id);

  res.json(orders);
};