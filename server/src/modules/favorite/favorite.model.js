import { db } from '../../config/knex.js';

const Favorite = {
  // --- Get all favorite product IDs for a user ---
  getByUserId: async (userId) => {
    const results = await db('favorites')
      .where('user_id', userId)
      .select('product_id');
    return results.map(r => r.product_id);
  },
  
  // --- Add a new favorite (prevents duplicates) ---
  add: async (userId, productId) => {
    const exists = await db('favorites')
      .where({ user_id: userId, product_id: productId })
      .first();
    
    if (exists) return null;
    
    return await db('favorites').insert({
      user_id: userId,
      product_id: productId
    });
  },
  
  // --- Remove a favorite ---
  remove: async (userId, productId) => {
    return await db('favorites')
      .where({ user_id: userId, product_id: productId })
      .del();
  }
};

export default Favorite;