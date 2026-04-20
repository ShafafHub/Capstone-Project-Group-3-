import express from 'express';
import auth from '../modules/auth/auth.routes.js';
import user from '../modules/user/user.routes.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/user', user);

export default router;