import * as model from './product.model.js';

export const getProducts = (db) => model.getAllProducts(db);

export const getSingleProduct = (db, id) =>
  model.getProductById(db, id);

export const addProduct = (db, data) =>
  model.createProduct(db, data);