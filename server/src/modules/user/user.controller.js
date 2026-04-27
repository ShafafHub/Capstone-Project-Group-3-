// --- import user service functions ---
import * as service from './user.service.js';

// --- controller: get current user profile ---
export const profile = async (req, res) => {
  const db = req.app.locals.db;

  const user = await service.getProfile(db, req.user.id);

  res.json(user);
};