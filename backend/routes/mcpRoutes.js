import express from 'express';
import {
  handleMcp,
  processCounselor,
  getCounselorStudents,
  getCounselorFlow
} from '../controllers/mcpController.js';

const router = express.Router();

router.get('/students', getCounselorStudents);
router.get('/flow', getCounselorFlow);
router.post('/mcp', handleMcp);
router.post('/process', processCounselor);

export default router;
