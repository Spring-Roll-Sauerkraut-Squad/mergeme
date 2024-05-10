import express from 'express';
import { getPotisions } from '../controllers/historicalHeatmapPositionsController.js';

const router = express.Router();

router.get('/', getPotisions);

export default router;