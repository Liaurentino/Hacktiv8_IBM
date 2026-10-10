import express from 'express';
import {
  getSubjects,
  getGradesBySubject,
  getStudentGrades,
  updateGrade,
  batchUpdateGrades
} from '../controllers/gradeController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/subjects', optionalAuth, getSubjects);
router.get('/student/:studentId', optionalAuth, getStudentGrades);
router.get('/subject/:subjectKey', optionalAuth, getGradesBySubject);
router.put('/:studentId/:subjectKey', authenticateToken, updateGrade);
router.post('/batch/:subjectKey', authenticateToken, batchUpdateGrades);

export default router;
