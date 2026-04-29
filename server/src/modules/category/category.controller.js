import * as model from './category.model.js';

// --- Get all categories ---
export const getAll = async (req, res) => {
  const db = req.app.locals.db;
  const data = await model.getAll(db);
  res.json(data);
};

// --- Create new category ---
export const create = async (req, res) => {
  const db = req.app.locals.db;
  const data = await model.create(db, req.body);
  res.json(data);
};

// --- Delete category by ID ---
export const remove = async (req, res) => {
  const db = req.app.locals.db;
  await model.remove(db, req.params.id);
  res.json({ message: 'deleted' });
};

// --- Update category by ID ---
export const update = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    await db('categories').where({ id }).update(req.body);
    const updated = await db('categories').where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};