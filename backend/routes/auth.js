import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/demo-login', authController.demoLogin);
router.get('/me', protect, authController.getMe);

export default router;
