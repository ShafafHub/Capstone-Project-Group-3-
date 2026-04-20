// --- Rate limiter middleware ---
import rateLimit from 'express-rate-limit';

// --- Set the time window to 15 minutes (in milliseconds) ---
export const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, })