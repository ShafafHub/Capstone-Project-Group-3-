import { body } from 'express-validator';

// --- Register validation rules ---
export const registerValidation = [ body('email').isEmail(), body('password').isLength({ min: 6 }), ]