import express from 'express';
import { create, getAll } from './order.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

// --- create router ---
const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', getAll);

export default router;