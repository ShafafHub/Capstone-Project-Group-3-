// --- Get all cart items for a user ---
export const getCartItems = (db, userId) => {
  return db('cart_items as c')
    .join('products as p', 'p.id', 'c.product_id')
    .select(
      'c.id',
      'c.product_id',
      'c.quantity',
      'c.color',
      'c.size',
      'p.name',
      'p.price',
      'p.image',
      'p.description'
    )
    .where('c.user_id', userId);
};

// --- Add item to cart (upsert logic) ---
export const addToCart = async (
  db,
  userId,
  productId,
  quantity = 1,
  color,
  size
) => {
  // Check if item already exists with same color and size
  const existing = await db('cart_items')
    .where({
      user_id: userId,
      product_id: productId,
      color,
      size,
    })
    .first();

  // If not exists, insert new item
  if (!existing) {
    return db('cart_items').insert({
      user_id: userId,
      product_id: productId,
      quantity,
      color,
      size,
    });
  }

  // If exists, update quantity
  return db('cart_items')
    .where({ id: existing.id })
    .update({
      quantity: existing.quantity + quantity,
    });
};

// --- Remove item from cart by ID ---
export const removeFromCart = (db, id) => {
  return db('cart_items')
    .where({ id: id })
    .del();
};