import express from 'express';
import { getAll, getOne, create, remove, update } from './product.controller.js';

const router = express.Router();

// --- Product routes ---
router.get('/', getAll);        // Get all products
router.get('/:id', getOne);     // Get single product by ID
router.post('/', create);       // Create new product
router.delete('/:id', remove);  // Delete product by ID
router.put('/:id', update);     // Update product by ID

export default router;