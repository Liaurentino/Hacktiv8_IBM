import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import privacyMaskerMiddleware from '../middleware/privacyMaskerMiddleware.js';
import safetyGuardrailMiddleware from '../middleware/safetyGuardrailMiddleware.js';

const router = express.Router();

router.get('/:studentId', getChatHistory);
router.post('/', privacyMaskerMiddleware, safetyGuardrailMiddleware, sendMessage);

export default router;
