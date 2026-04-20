import * as model from './order.model.js';

export const placeOrder = (db, userId, items, total) =>
  model.createOrder(db, userId, items, total);

export const getUserOrders = (db, userId) =>
  model.getOrders(db, userId);