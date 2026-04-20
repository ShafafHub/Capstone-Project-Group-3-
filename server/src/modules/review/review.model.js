export const addReview = (db, data) => {
  return db.run(
    `INSERT INTO reviews (product_id, content) VALUES (?, ?)`,
    [data.product_id, data.content]
  );
};