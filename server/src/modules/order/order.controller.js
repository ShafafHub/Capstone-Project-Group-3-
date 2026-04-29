import * as service from './order.service.js';

export const create = async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    const { items, total } = req.body;

    const orderId = await service.placeOrder(
      db,
      req.user.id,
      items,
      total
    );

    res.status(201).json({ orderId });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const db = req.app.locals.db;

    const orders = await service.getUserOrders(
      db,
      req.user.id
    );

    res.json(orders);
  } catch (err) {
    next(err);
  }
};