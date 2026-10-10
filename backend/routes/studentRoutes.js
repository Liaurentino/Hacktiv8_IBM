import express from 'express';
import {
  getAllStudents,
  generatePassword,
  getStudentById,
  createStudent,
  batchCreateStudents,
  updateStudent,
  deleteStudent,
  getMyProfile,
  getStudentMe
} from '../controllers/studentController.js';

import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getAllStudents);
router.get('/generate-password', generatePassword);
router.get('/profile/me', getMyProfile);
router.get('/me', authenticateToken, getStudentMe);
router.get('/:id', optionalAuth, getStudentById);
router.post('/', createStudent);
router.post('/batch', batchCreateStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
