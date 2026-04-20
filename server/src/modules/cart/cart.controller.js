import * as service from './cart.service.js';
import { dbPromise } from '../../config/db.js';

// --- Get Cart Data ---
export const getCart = async (req, res) => {
  const db = await dbPromise;
  const data = await service.getCart(db, req.user.id);
  res.json(data);
}

// --- Add Item to Cart ---
export const add = async (req, res) => {
  const db = await dbPromise;

  const { productId, quantity } = req.body;

  await service.addItem(
    db,
    req.user.id,
    productId,
    quantity
  )

  res.json({ message: 'added' })
}

// --- Remove Item from Cart ---
export const remove = async (req, res) => {
  const db = await dbPromise;
  await service.removeItem(db, req.params.id);
  res.json({ message: 'removed' });
}