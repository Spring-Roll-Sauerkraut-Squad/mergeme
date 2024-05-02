import express from 'express';
import { getAirports } from '../controller/AirportController.js';
import Airport from '../models/AirportModel.js';

const router = express.Router();

// find DE not working
router.get('/', async (req, res) => {
    try {
        const airports = await Airport.find({ iso_country: 'DE'});
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;