import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: String,
    latitude_deg: Number,
    longitude_deg: Number,
    iso_country: String
});

const Airport = mongoose.model('Airport', airportSchema);

export default Airport;


/*
const airportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude_deg: { type: Number, required: true },
    longitude_deg: { type: Number, required: true }
});
*/