import express from 'express';
import { create } from './review.controller.js';

const router = express.Router();

router.post('/', create);

export default router;