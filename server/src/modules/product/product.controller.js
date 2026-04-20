import * as service from './product.service.js';
import { dbPromise } from '../../config/db.js';

export const getAll = async (req, res) => {
  const db = await dbPromise;
  const data = await service.getProducts(db);
  res.json(data);
};

export const getOne = async (req, res) => {
  const db = await dbPromise;
  const data = await service.getSingleProduct(db, req.params.id);
  res.json(data);
};

export const create = async (req, res) => {
  const db = await dbPromise;
  const product = await service.addProduct(db, req.body);
  res.json(product);
};