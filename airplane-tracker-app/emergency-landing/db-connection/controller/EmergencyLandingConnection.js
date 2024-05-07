import EmergencyAirports from '../models/EmergencyAirportModel.js';

export async function getEmergencyAirports(req, res) {
    try {
        const airports = await EmergencyAirports.find({});
        res.json(airports);
    } catch (error) {
        console.error('Failed to retrieve emergency airports:', error);
        res.status(500).send('Error fetching emergency airports');
    }
}