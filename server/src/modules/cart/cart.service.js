// --- Add item to cart (upsert logic) ---
export const addToCart = async (
  db,
  userId,
  productId,
  quantity = 1,
  color,
  size,
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