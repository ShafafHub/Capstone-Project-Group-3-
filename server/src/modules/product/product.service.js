import * as model from './product.model.js'

export const getProducts = (db) => {
  return model.getAllProducts(db)
}

export const getSingleProduct = (db, id) => {
  return model.getProductById(db, id)
}

export const addProduct = (db, data) => {
  return model.createProduct(db, data)
}