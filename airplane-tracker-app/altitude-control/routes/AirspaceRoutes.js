import express from 'express';
import Airspace from '../models/AirspaceModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const airspaces = await Airspace.find();
        res.json(airspaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;