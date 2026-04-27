// /server/src/modules/review/review.model.js

import db from "../../config/db.js";

export const addReview = async (data) => {
  const result = await db("reviews").insert({
    product_id: data.product_id,
    rating: data.rating,
    content: data.content,
  });

  return result;
};