import express from 'express';
import {
  login,
  register,
  googleAuth,
  getMe,
  logout,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);
router.get('/me', authenticateToken, getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
