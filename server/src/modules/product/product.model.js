
export const getAllProducts = (db) => {
  return db('products')
    .select('*')
    .orderBy('id', 'desc');
};


export const getProductById = (db, id) => {
  return db('products')
    .where({ id })
    .first();
};


export const createProduct = (db, product) => {
  return db('products')
    .insert(product);
};