import express from 'express';
import { getTopLines } from '../controllers/historicalTopLinesController.js';

const router = express.Router();

router.get('/', getTopLines);

export default router;
