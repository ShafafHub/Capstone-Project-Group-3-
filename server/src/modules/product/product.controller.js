import * as service from './product.service.js';

// --- Get all products ---
export const getAll = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    const { sort } = req.query;

    let data = await service.getProducts(db);

    // --- Filter for new products if sort param is 'new' ---
    if (sort === 'new') {
      data = data.filter(p => p.is_new === 1 || p.is_new === true);
    }

    res.json(data);
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// --- Get single product by ID ---
export const getOne = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    const data = await service.getSingleProduct(db, req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('getOne error:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// --- Create new product ---
export const create = async (req, res) => {
  try {
    const db = req.app.locals.db;

    if (!db) {
      return res.status(500).json({ message: 'Database not initialized' });
    }

    const product = await service.addProduct(db, req.body);

    res.status(201).json(product);
  } catch (err) {
    console.error('create error:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// --- Delete product by ID ---
export const remove = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const deleted = await db('products')
      .where({ id: req.params.id })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'delete failed' });
  }
};

// --- Update product by ID ---
export const update = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    const updatedRows = await db('products')
      .where({ id })
      .update(req.body);

    if (!updatedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updated = await db('products').where({ id }).first();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};