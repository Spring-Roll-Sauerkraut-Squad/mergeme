import express from 'express';
import Airport from '../models/AirportModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    let countryCode = req.query.iso_country || "DE";
    let type_large = "large_airport";
    let type_large_medium = req.query.type ? req.query.type.split(',') : ["large_airport", "medium_airport"];

    try {
        const airports = await Airport.find({
            iso_country: countryCode,
            type: type_large,
            //type: { $in: types }
        });
        res.json(airports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;