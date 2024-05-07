import express from 'express';
import { getEmergencyAirports } from '../controller/EmergencyLandingConnection.js';
import EmergencyAirports from '../models/EmergencyAirportModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    
    let countryCode = req.query.iso_country || "DE";

    try {
        const airports = await EmergencyAirports.find({
            iso_country: countryCode,
        });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;