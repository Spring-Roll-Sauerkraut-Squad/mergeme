import express from 'express';
import { getTopAirports } from '../controllers/historicalTopAirportsController.js';

const router = express.Router();

router.get('/', getTopAirports);

export default router;
