import express from 'express';
import { getAll, getOne, create } from './product.controller.js';

// --- create router ---
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);

export default router;