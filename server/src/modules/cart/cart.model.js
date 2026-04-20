// --- Get Cart Items for User ---
export const getCartItems = (db, userId) => {
  return db.all(
    `SELECT c.id, c.product_id, c.quantity, p.name, p.price
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
    [userId]
  )
}
// --- Add Product to Cart ---
export const addToCart = (db, userId, productId, quantity) => {
  return db.run(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)`,
    [userId, productId, quantity]
  )
}
// --- Remove Product from Cart ---
export const removeFromCart = (db, id) => {
  return db.run(`DELETE FROM cart_items WHERE id = ?`, [id])
}