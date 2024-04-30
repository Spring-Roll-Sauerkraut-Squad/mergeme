import express from 'express';
import { getAirports } from '../controller/AirportController.js';

const router = express.Router();

router.get('/', getAirports);

export default router;