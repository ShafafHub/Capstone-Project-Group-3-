import Favorite from './favorite.model.js';

// --- Get favorites by user ID ---
export const getFavorites = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const favorites = await Favorite.getByUserId(userId);
    res.json({ success: true, favorites });
  } catch (error) {
    console.error('Error in getFavorites:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Add product to favorites ---
export const addFavorite = async (req, res) => {
  console.log('addFavorite called with body:', req.body);
  try {
    const { user_id, product_id } = req.body;
    
    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, error: 'user_id and product_id are required' });
    }
    
    await Favorite.add(user_id, product_id);
    res.json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    console.error('Error in addFavorite:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Remove product from favorites ---
export const removeFavorite = async (req, res) => {
  console.log('removeFavorite called with body:', req.body);
  try {
    const { user_id, product_id } = req.body;
    
    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, error: 'user_id and product_id are required' });
    }
    
    await Favorite.remove(user_id, product_id);
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};