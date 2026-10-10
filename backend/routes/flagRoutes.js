import express from 'express';
import { getAllFlags, updateFlagStatus } from '../controllers/flagController.js';

const router = express.Router();

router.get('/', getAllFlags);
router.patch('/:id', updateFlagStatus);

export default router;
