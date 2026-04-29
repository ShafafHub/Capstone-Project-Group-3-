import * as service from './cart.model.js';

// --- Get cart items for authenticated user ---
export const getCart = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.getCartItems(db, userId);
    res.json(data);
  } catch (err) {
    console.error('getCart failed:', err);
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
};

// --- Add item to cart ---
export const add = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { product_id, quantity = 1, color, size } = req.body;

    await service.addToCart(db, userId, product_id, quantity, color, size);

    res.json({ message: 'added' });
  } catch (err) {
    console.error('addToCart failed:', err);
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
};

// --- Remove item from cart ---
export const remove = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await service.removeFromCart(db, req.params.id);

    res.json({ message: 'removed' });
  } catch (err) {
    console.error('removeFromCart failed:', err);
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
};