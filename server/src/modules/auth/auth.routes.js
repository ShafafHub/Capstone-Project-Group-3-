import express from 'express';
import { register, login } from './auth.controller.js';

// --- Create a new router instance ---
const router = express.Router()

// --- Register and Login routes ---
router.post('/register', register)
router.post('/login', login)

export default router