import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: String,
    latitude_deg: String,
    longitude_deg: String
});

const Airport = mongoose.model('Airport', airportSchema);

export default Airport;