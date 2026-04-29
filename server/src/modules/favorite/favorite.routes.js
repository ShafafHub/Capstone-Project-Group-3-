import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from './favorite.controller.js';

const router = express.Router();

// --- Favorite routes ---

// Get favorites by user ID
router.get('/:userId', getFavorites);

// Add product to favorites
router.post('/add', addFavorite);

// Remove product from favorites
router.delete('/remove', removeFavorite);

// --- Test route ---
router.get('/test', (req, res) => {
  res.json({ message: 'Favorites route is working!' });
});

export default router;