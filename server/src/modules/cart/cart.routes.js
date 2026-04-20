import express from 'express';
import { getCart, add, remove } from './cart.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

// --- create router ---
const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', add);
router.delete('/:id', remove);

export default router;