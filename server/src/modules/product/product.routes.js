import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { adminMiddleware } from '../../middlewares/admin.middleware.js'

import express from 'express';
import { getAll, getOne, create } from './product.controller.js';

// --- create router ---
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, adminMiddleware, create);

export default router;