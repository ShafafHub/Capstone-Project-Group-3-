import { validationResult } from 'express-validator';

// --- Validation middleware ---
export const validate = (req, res, next) => {
     const errors = validationResult(req)
     if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) } next() }