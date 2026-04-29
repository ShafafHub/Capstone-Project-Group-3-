import express from 'express';
import { adminLogin, getDashboardData } from './admin.controller.js';
import { adminAuthMiddleware } from '../../middlewares/admin.auth.middleware.js';

const router = express.Router();

// --- Admin login (without token) ---
router.post('/login', adminLogin);

// --- Get dashboard data (after login) ---
router.post('/dashboard-data', adminAuthMiddleware, getDashboardData);

export default router;