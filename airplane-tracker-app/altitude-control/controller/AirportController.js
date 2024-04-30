import Airport from '../models/AirportModel.js';

export async function getAirports(req, res) {
    try {
        const airports = await Airport.find({});
        res.json(airports);
    } catch (error) {
        console.error('Failed to retrieve airports:', error);
        res.status(500).send('Error fetching airports');
    }
}