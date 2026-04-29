import express from 'express';
import * as ctrl from './category.controller.js';

const router = express.Router();

// --- Category routes ---

// Get all categories
router.get('/', ctrl.getAll);

// Create new category
router.post('/', ctrl.create);

// Delete category by ID
router.delete('/:id', ctrl.remove);

// Update category by ID
router.put('/:id', ctrl.update);

export default router;