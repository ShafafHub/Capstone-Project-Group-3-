// server/src/modules/product/product.service.js

import db from "../../config/db.js";
import * as model from "./product.model.js";

export const getProducts = () => {
  return model.getAllProducts(db);
};

export const getSingleProduct = (id) => {
  return model.getProductById(db, id);
};

export const addProduct = (data) => {
  return model.createProduct(db, data);
};