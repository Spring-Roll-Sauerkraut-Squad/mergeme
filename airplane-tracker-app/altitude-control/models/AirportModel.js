import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: String,
    latitude_deg: Number,
    longitude_deg: Number,
    iso_country: String,
    type: String
});

const Airport = mongoose.model('Airport', airportSchema);

export default Airport;