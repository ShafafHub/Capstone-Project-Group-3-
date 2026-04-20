import * as service from './review.service.js';
import { dbPromise } from '../../config/db.js';

export const create = async (req, res) => {
  const db = await dbPromise;

  await service.createReview(db, req.body);

  res.json({ message: 'review added' });
};