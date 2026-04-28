import * as service from "./product.service.js";

export const getAll = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: "Database not initialized" });
    }

    const { sort } = req.query;

    let products = await service.getProducts(db);

    if (sort === "new") {
      products = products.filter(
        (product) =>
          product.is_new === 1 || product.is_new === true
      );
    }

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getOne = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: "Database not initialized" });
    }

    const { id } = req.params;

    const product = await service.getSingleProduct(db, id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const create = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: "Database not initialized" });
    }

    const createdProduct = await service.addProduct(db, req.body);

    return res.status(201).json(createdProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
  }
};