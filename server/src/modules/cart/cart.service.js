import * as model from './cart.model.js';

export const getCart = (db, userId) =>
  model.getCartItems(db, userId);

export const addItem = (db, userId, productId, quantity) =>
  model.addToCart(db, userId, productId, quantity);

export const removeItem = (db, id) =>
  model.removeFromCart(db, id);