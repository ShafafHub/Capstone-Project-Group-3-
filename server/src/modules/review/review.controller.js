// --- import review service functions ---
import * as service from './review.service.js';

// --- controller: create new review ---
export const create = async (req, res) => {
  const db = req.app.locals.db;

  await service.createReview(db, req.body);

  res.json({ message: 'review added' });
};