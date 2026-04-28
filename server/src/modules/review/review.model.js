export const addReview = (db, data) => {
  return db('reviews').insert({
    product_id: data.product_id,
    rating: data.rating,
    content: data.content
  })
}