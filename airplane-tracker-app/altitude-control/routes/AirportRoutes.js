import express from 'express';
import Airport from '../models/AirportModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let countryCode = req.query.iso_country || "DE";

    // Filter only for large size / intern Airports
    //let type_filter = "large_airport";

    // Filter for large size / intern AND medium size Airports
    let type_filter = req.query.type ? req.query.type.split(',') : ["large_airport", "medium_airport"];

    try {
        const airports = await Airport.find({
            iso_country: countryCode,
            type: type_filter,
        });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;