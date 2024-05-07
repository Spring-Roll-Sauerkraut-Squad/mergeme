import mongoose from 'mongoose';

const emergencyAirportSchema = new mongoose.Schema({
    type: String,
    name: String,
    iso_country: String,
    latitude_deg: String,
    longitude_deg: String
});

const EmergencyAirports = mongoose.model('Airports', emergencyAirportSchema);

export default EmergencyAirports;