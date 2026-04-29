// --- Get all categories ---
export const getAll = (db) => db('categories');

// --- Create new category ---
export const create = (db, data) =>
  db('categories').insert(data);

// --- Delete category by ID ---
export const remove = (db, id) =>
  db('categories').where({ id }).del();