import * as model from './user.model.js';

export const getProfile = (db, id) =>
  model.getUserById(db, id);