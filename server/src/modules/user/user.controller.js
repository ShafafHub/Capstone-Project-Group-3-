import * as service from './user.service.js';
import { dbPromise } from '../../config/db.js';

export const profile = async (req, res) => {
  const db = await dbPromise;

  const user = await service.getProfile(db, req.user.id);

  res.json(user);
};