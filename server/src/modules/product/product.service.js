import * as model from './product.model.js';

// --- Get all products ---
export const getProducts = (db) => {
  return model.getAllProducts(db);
};

// --- Get single product by ID ---
export const getSingleProduct = (db, id) => {
  return model.getProductById(db, id);
};

// --- Add new product ---
export const addProduct = (db, data) => {
  return model.createProduct(db, data);
};