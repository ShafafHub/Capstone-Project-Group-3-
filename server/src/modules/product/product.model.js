// --- Get all products ordered by ID descending ---
export const getAllProducts = (db) =>
  db('products').orderBy('id', 'desc');

// --- Get single product by ID ---
export const getProductById = (db, id) =>
  db('products').where({ id }).first();

// --- Create new product ---
export const createProduct = (db, product) =>
  db('products').insert(product);