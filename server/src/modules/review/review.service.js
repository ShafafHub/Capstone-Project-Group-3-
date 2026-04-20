import * as model from './review.model.js';

export const createReview = (db, data) =>
  model.addReview(db, data);